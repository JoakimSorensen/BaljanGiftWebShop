from server import db
from server.models.shared_model import SharedModel


class Product(SharedModel):
    id = db.Column(db.Text, index=True, unique=True)
    name = db.Column(db.Text, index=True)
    price = db.Column(db.Integer, index=True)
    allergen = db.Column(db.Text, index=True)
    image = db.Column(db.Text)
    #Hur refererar vi till en bild? en .svg-fil?

    mutable_fields = {name, price, allergen, image}
    required_fields = {id, name, price}
    excluded_fields = set()

