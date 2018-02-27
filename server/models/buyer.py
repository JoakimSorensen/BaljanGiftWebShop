from server import db
from server.models.shared_model import SharedModel


class Buyer(SharedModel):
    email = db.Column(db.Text, index=True)
    name = db.Column(db.Text, index=True)

    mutable_fields = set()
    required_fields = {email, name}
    excluded_fields = set()
