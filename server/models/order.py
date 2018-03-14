from server import db
from server.models import GiftBox
from server.models.buyer import Buyer
from server.models.receiver import Receiver
from server.models.shared_model import SharedModel


class Order(SharedModel):
    date = db.Column(db.TIMESTAMP, index=True)
    price = db.Column(db.Integer, index=True)
    status = db.Column(db.String(120), default='processing', index=True)

    mutable_fields = {date, price, status}
    required_fields = {date, price}
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

    def set_date(self, date):
        self.date = date
        db.session.commit()
    
    def set_price(self, price):
        self.price = price
        db.session.commit()
    
    def set_status(self, status):
        statuses = ['processing', 'preparing', 'received']
        if status not in statuses:
            raise InvalidStatusException("Status need to be 'processing', 'preparing' or 'received'")
        self.status = status
        db.session.commit()
    
    def set_buyer(self, buyer_id):
        self.buyer_id = buyer_id
        db.session.commit()
    
    def set_receiver(self, receiver_id):
        self.receiver_id = receiver_id
        db.session.commit()
    
    def set_giftbox(self, giftbox_id):
        self.giftbox_id = giftbox_id
        db.session.commit()

class InvalidStatusException(Exception):
    pass
