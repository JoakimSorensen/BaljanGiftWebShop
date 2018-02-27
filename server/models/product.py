from server import db
from server.models.shared_model import SharedModel


class Product(SharedModel):
    name = db.Column(db.Text, index=True)
    price = db.Column(db.Integer, index=True)
    allergen = db.Column(db.Text, index=True)
    image = db.Column(db.Text)

    mutable_fields = {name, price, allergen, image}
    required_fields = {name, price}
    excluded_fields = set()

