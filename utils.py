import json
import os

import datetime

import phonenumbers


def get_file_path(caller_path, relative_path):
    return os.path.join(os.path.dirname(os.path.abspath(caller_path)), relative_path)


def load_json_from_relative_path(caller_path, relative_path, custom_encoder=None):
    target_path = get_file_path(caller_path, relative_path)
    with open(target_path, 'r', encoding="utf-8") as json_data:
        data = json.load(json_data, cls=custom_encoder)
        return data


def dump_json_to_relative_path(caller_path, relative_path, data, custom_encoder=None):
    target_path = get_file_path(caller_path, relative_path)
    os.makedirs(os.path.dirname(target_path), exist_ok=True)
    with open(target_path, 'w') as target_file:
        json.dump(data, target_file, cls=custom_encoder)


def json_converter(obj):
    if isinstance(obj, datetime.datetime):
        return obj.isoformat()
    error_message = "No converter implemented for type '{0}'".format(type(obj))
    raise TypeError(error_message)


def format_phone_number(phone_number_string):
    phone_number = phonenumbers.parse(phone_number_string, "SE")
    return phonenumbers.format_number(phone_number, phonenumbers.PhoneNumberFormat.E164)
