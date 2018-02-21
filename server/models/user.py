from server import db
from server.models.shared_model import SharedModel


class User(SharedModel):
    username = db.Column(db.Text, index=True, unique=True)
    email = db.Column(db.Text, index=True, unique=True)
    password_hash = db.Column(db.Text)

    mutable_fields = set()
    required_fields = {username, email}
    excluded_fields = {password_hash}

