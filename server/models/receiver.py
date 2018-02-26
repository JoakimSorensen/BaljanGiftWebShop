from server import db
from server.models.shared_model import SharedModel


class Receiver(SharedModel):
    id = db.Column(db.Integer, index=True, unique=True)
    liu_id = db.Column(db.Text, index=True)
    name = db.Column(db.Text, index=True)
    phone = db.Column(db.BigInteger, index=True)

    mutable_fields = set()
    required_fields = {id, liu_id, name, phone}
    excluded_fields = set()

