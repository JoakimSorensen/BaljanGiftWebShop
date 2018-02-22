from server import db
from server.models.shared_model import SharedModel


class Buyer(SharedModel):
    id = db.Column(db.Integer, index=True, unique=True)
    email = db.Column(db.Text, index=True)
    name = db.Column(db.Text, index=True)

    mutable_fields = set()
    required_fields = {id, email, name}
    excluded_fields = set()