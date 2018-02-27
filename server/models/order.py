from server import db
from server.models import GiftBox
from server.models.buyer import Buyer
from server.models.receiver import Receiver
from server.models.shared_model import SharedModel


class Order(SharedModel):
    date = db.Column(db.TIMESTAMP, index=True)
    price = db.Column(db.Integer, index=True)
    status = db.Column(db.Interval, index=True)

    mutable_fields = set()
    required_fields = {date, price, status}
    excluded_fields = set()

    # Foreign key relationships defined via backrefs

    buyer_id = db.Column(db.Integer, db.ForeignKey(Buyer.id), nullable=False)
    buyer = db.relationship(Buyer, foreign_keys=[buyer_id], single_parent=True,
                            backref=db.backref('orders', uselist=True, cascade="all"))

    receiver_id = db.Column(db.Integer, db.ForeignKey(Receiver.id), nullable=False)
    receiver = db.relationship(Receiver, foreign_keys=[receiver_id], single_parent=True,
                               backref=db.backref('orders', uselist=True, cascade="all"))

    giftbox_id = db.Column(db.Integer, db.ForeignKey(GiftBox.id), nullable=False)
    giftbox = db.relationship(GiftBox, foreign_keys=[giftbox_id], single_parent=True,
                              backref=db.backref('orders', uselist=True, cascade="all"))




