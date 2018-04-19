import datetime
import uuid

from server import db
from server.models import GiftBox
from server.models.buyer import Buyer
from server.models.receiver import Receiver
from server.models.shared_model import SharedModel
from server.models.custom_types import OrderStatus


class Order(SharedModel):
    date = db.Column(db.TIMESTAMP, index=True)
    price = db.Column(db.Integer, index=True)
    status = db.Column(db.Enum(OrderStatus), default=OrderStatus.NOTIFIED, index=True)
    message = db.Column(db.Text)
    token = db.Column(db.String(128), index=True)

    mutable_fields = {date, price, status, message}
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

    @classmethod
    def create_order(cls, giftbox, buyer, receiver, message):
        token = cls._generate_token(4)
        order = Order.add(price=giftbox.price,
                          giftbox_id=giftbox.id,
                          date=datetime.datetime.now(),
                          buyer_id=buyer.id,
                          message=message,
                          receiver_id=receiver.id,
                          token=token)
        return order

    # use this for status text representation 
    @classmethod
    def get_status_text(cls, status):
        if isinstance(status, OrderStatus):
            return {OrderStatus.NOTIFIED: "Ett sms har blivit skickat till mottagaren", 
                    OrderStatus.PREPARING: "Gåvan håller på att packas av Baljan", 
                    OrderStatus.RECEIVED: "Gåvan har blivit uthämtad av mottagaren", 
                    OrderStatus.CANCELED: "Beställningen har blivit avbruten"}[status]
        raise InvalidStatusException("Status need to be of type server.models.custom_types.OrderStatus,"\
                " one of {}".format([str(st) for st in OrderStatus]))

    def check_token(self, token):
        return self.token == token

    def set_date(self, date):
        self.date = date
        db.session.commit()
    
    def set_price(self, price):
        self.price = price
        db.session.commit()
    
    def set_status(self, status):
        if not isinstance(status, OrderStatus):
            raise InvalidStatusException("Status need to be of type server.models.custom_types.OrderStatus,"\
                    " one of {}".format([str(st) for st in OrderStatus]))
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

    def set_message(self, message):
        self.message = message
        db.session.commit()

    @staticmethod
    def _generate_token(token_length):
        token = str(uuid.uuid4())
        token = token.replace("-", "")
        return token[0:token_length].upper()


class InvalidStatusException(Exception):
    pass
