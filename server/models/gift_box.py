from server import db

from server.models.shared_model import SharedModel


class GiftBoxProduct(SharedModel):

    gift_box_id = db.Column(db.Integer, db.ForeignKey('gift_box.id'))
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'))

    mutable_fields = set()
    required_fields = set()
    excluded_fields = set()


class GiftBox(SharedModel):
    name = db.Column(db.Text, index=True)
    price = db.Column(db.Integer, index=True)
    description = db.Column(db.Text, index=True)
    image = db.Column(db.Text)

    mutable_fields = {name, price, description, image}
    required_fields = {name, price}
    excluded_fields = set()

    products = db.relationship(GiftBoxProduct, primaryjoin='GiftBox.id==GiftBoxProduct.gift_box_id')

    def set_name(self, name):
        self.name = name
        db.session.commit()

    def set_price(self, price):
        self.price = price
        db.session.commit()

    def set_description(self, description):
        self.description = description
        db.session.commit()

    def set_image(self, image):
        self.image = image
        db.session.commit()
