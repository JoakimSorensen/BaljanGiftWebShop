from server import db
from server.models.shared_model import SharedModel


class GiftBox(SharedModel):
    name = db.Column(db.Text, index=True)
    price = db.Column(db.Integer, index=True)
    description = db.Column(db.Text, index=True)
    image = db.Column(db.Text)

    mutable_fields = {name, price, description, image}
    required_fields = {name, price}
    excluded_fields = set()

