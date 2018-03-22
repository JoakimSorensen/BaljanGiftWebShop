from server import db
from server.models.shared_model import SharedModel
from utils import format_phone_number


class Receiver(SharedModel):
    liu_id = db.Column(db.Text, index=True)
    name = db.Column(db.Text, index=True)
    phone = db.Column(db.String(120), index=True)

    mutable_fields = set()
    required_fields = {liu_id, name, phone}
    excluded_fields = set()

    @classmethod
    def create_receiver(cls, name, phone, liu_id):
        formatted_phone_number = format_phone_number(phone)
        return Receiver.add(name=name, phone=formatted_phone_number, liu_id=liu_id)

    def __repr__(self):
        return self.name

