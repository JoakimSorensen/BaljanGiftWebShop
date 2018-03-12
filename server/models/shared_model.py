import datetime
import json
from enum import Enum
import copy

import sqlalchemy
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.exc import IntegrityError, DataError
from sqlalchemy.orm.properties import RelationshipProperty
from sqlalchemy import inspect
import collections

from server import db
from utils import json_converter


class SharedModel(db.Model):
    """`SharedModel` is a common subclass of `db.model` which provides common required fields and shared functionality
    that is needed in all model classes """

    __abstract__ = True

    # Hooks for on_create and on_update
    # https://stackoverflow.com/questions/4309607/whats-the-preferred-way-to-implement-a-hook-or-callback-in-python
    # Since this is a shared class, the hooks are registered in a dictionary on the form {'class_name': [...hooks]},
    # because all sub-classes of this class will have access to all hooks.
    _on_create = {}
    _on_update = {}

    @classmethod
    def on_create(cls, func):
        class_name = cls.__name__
        if cls._on_create.get(class_name) is None:
            cls._on_create[class_name] = []

        cls._on_create[class_name].append(func)

    @classmethod
    def _execute_on_create(cls, instance):
        class_name = cls.__name__
        for func in cls._on_create.get(class_name, []):
            func(instance)

    @classmethod
    def on_update(cls, func):
        class_name = cls.__name__
        if cls._on_update.get(class_name) is None:
            cls._on_update[class_name] = []

        cls._on_update[class_name].append(func)

    @classmethod
    def _execute_on_update(cls, instance, previous_state=None):
        class_name = cls.__name__
        for func in cls._on_update.get(class_name, []):
            func(instance, previous_state)

    # Common required fields
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    created = db.Column(db.DateTime(timezone=True), default=db.func.now())
    modified = db.Column(db.DateTime(timezone=True), default=db.func.now(), onupdate=db.func.now())

    excluded_fields = set()
    required_fields = None
    mutable_fields = None

    def __repr__(self):
        """
        Return string description of model object instance
        :return: str
        """
        format_string = "{class_name} {identifier}"
        class_name = self.__class__.__name__
        try:
            identifier = self.name
        except AttributeError:
            identifier = self.id

        return format_string.format(class_name=class_name, identifier=identifier)

    def to_dict(self):
        """Return dict containing the keys and values of all property columns, and the keys and identifiers of
        all N-1 or 1-1 relationships for the current model object instance
        Edited 180312 by Joakim Sorensen: Added timedelta check to dict building"""
        orm_descriptors = inspect(type(self)).all_orm_descriptors
        excluded_fields_keys = [excluded_field.key for excluded_field in self.excluded_fields]

        modified_descriptors = []
        for key, value in orm_descriptors.items():
            # In the return value from `all_orm_descriptors` we get a `Mapper` instance which we ignore
            if type(value) is sqlalchemy.orm.Mapper:
                continue

            if key in excluded_fields_keys:
                continue

            try:
                # Will return either `ColumnProperty` or `RelationshipProperty`
                property_type = type(value.property)
            except AttributeError as e:
                err = e

                # Hybrid properties does not have a `property value`.
                # Let's ensure we are dealing with a Hybrid property
                if type(value) is hybrid_property:
                    property_type = hybrid_property

                # If not, something have gone wrong, so let's throw the original exception:
                else:
                    raise err from None
            modified_descriptors.append((key, property_type))

        return_dict = {}

        for (key, property_type) in modified_descriptors:
            try:
                value = getattr(self, key)
                if isinstance(value, datetime.timedelta):
                    value = str(value)
                if isinstance(value, collections.Iterable) and property_type is RelationshipProperty:
                    # We will only return N-1 or 1-1 relationships
                    continue

                if property_type is RelationshipProperty:
                    # We will return the ID of the foreign key
                    value = value.id

                # Return the 'value' for Enums
                if isinstance(value, Enum):
                    value = value.value

                # Return ISO-strings for datetimes
                if isinstance(value, (datetime.datetime, datetime.date)):
                    value = value.isoformat()

            except AttributeError:
                value = None
            return_dict[key] = value
        return return_dict

    def to_json(self, sort_keys=False):
        """
        Return a JSON representation of `to_dict()`. The output is indented (pretty-printed) and will serialize complex
        attributes.
        :param sort_keys:
        :return: str
        """
        return json.dumps(self.to_dict(), indent=True, default=json_converter, sort_keys=sort_keys)

    @classmethod
    def add(cls, **kwargs):
        argument_keys_set = set(kwargs.keys())

        cls._check_required_parameters(argument_keys_set, check_required=True, check_mutable=False)

        instance = cls(**kwargs)
        db.session.add(instance)
        try:
            db.session.commit()
        except (IntegrityError, DataError) as e:
            # Session should rollback
            db.session.rollback()
            raise e

        # Execute hooks
        # Todo: Execute hooks async
        cls._execute_on_create(instance)

        return instance

    @classmethod
    def update(cls, instance_id, **kwargs):
        argument_keys_set = set(kwargs.keys())
        cls._check_required_parameters(argument_keys_set, check_required=False, check_mutable=True)
        instance = db.session.query(cls).get(instance_id)
        instance_copy = copy.copy(instance)
        for key, value in kwargs.items():
            setattr(instance, key, value)
        try:
            db.session.commit()
        except (IntegrityError, DataError) as e:
            # Session should rollback
            db.session.rollback()
            raise e

        # Execute hooks
        # Todo: Execute hooks async
        cls._execute_on_update(instance, instance_copy)

        return instance

    @classmethod
    def delete(cls, instance_id):
        instance = db.session.query(cls).get(instance_id)
        if not instance:
            raise ValueError("No instance of {class_name} with ID: {instance_id}".format(
                class_name=cls.__name__, instance_id=instance_id))
        db.session.delete(instance)

        '''
        instance = db.session.query(cls).filter(cls.id == instance_id).delete()
        if instance == 0:
            raise ValueError("No instance of {class_name} with ID: {instance_id}".format(
                class_name=cls.__name__, instance_id=instance_id))
        '''

        db.session.commit()
        return instance_id

    @classmethod
    def _check_required_parameters(cls, argument_keys_set, check_required=False, check_mutable=False):
        attributes = set(inspect(cls).attrs.keys())
        try:
            if cls.required_fields is None:
                raise NameError("Class {} must implement variable named `required_fields`".format(cls.__name__))
        except AttributeError:
            raise NameError("Class {} must implement variable named `required_fields`".format(cls.__name__))

        try:
            if cls.mutable_fields is None:
                raise NameError("Class {} must implement variable named `mutable_fields`".format(cls.__name__))
        except AttributeError:
            raise NameError("Class {} must implement variable named `mutable_fields`".format(cls.__name__))

        if len(argument_keys_set - attributes) > 0:
            # We have arguments that are not present in the model
            unexpected_arguments = [arg for arg in argument_keys_set if arg not in attributes]
            raise AttributeError("Unexpected field: {}".format(unexpected_arguments))

        if check_required:
            required_fields = {required_field.name for required_field in cls.required_fields}
            if len(required_fields - argument_keys_set) > 0:
                # We have required fields that are not present in the arguments
                missing_fields = [arg for arg in required_fields if arg not in argument_keys_set]
                raise AttributeError("Missing required fields: {}".format(missing_fields))
        if check_mutable:
            mutable_fields = {mutable_field.name for mutable_field in cls.mutable_fields}
            # The argument keys set should only contain mutable values
            if len(argument_keys_set - mutable_fields) > 0:
                unexpected_arguments = [arg for arg in argument_keys_set if arg not in mutable_fields]
                raise AttributeError("Unexpected field: {}".format(unexpected_arguments))
