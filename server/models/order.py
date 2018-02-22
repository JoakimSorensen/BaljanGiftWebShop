from server import db
from server.models.shared_model import SharedModel


class Buyer(SharedModel):
    id = db.Column(db.Integer, index=True, unique=True)
    date = db.Column(db.TIMESTAMP, index=True)
    price = db.Column(db.Integer, index=True)
    status = db.Column(db.Interval, index=True)
    receiver = db.Column(db.Integer, index=True, unique=True)
    buyer = db.Column(db.Integer, index=True, unique=True)
    giftbox = db.Column(db.Integer, index=True, unique=True)


    mutable_fields = set()
    required_fields = {id, date, price, status, receiver, buyer, giftbox}
    excluded_fields = set()

