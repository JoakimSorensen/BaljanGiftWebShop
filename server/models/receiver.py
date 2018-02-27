from server import db
from server.models.shared_model import SharedModel


class Receiver(SharedModel):
    liu_id = db.Column(db.Text, index=True)
    name = db.Column(db.Text, index=True)
    phone = db.Column(db.BigInteger, index=True)

    mutable_fields = set()
    required_fields = {liu_id, name, phone}
    excluded_fields = set()

