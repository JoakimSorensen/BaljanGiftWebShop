from server import db
from server.models.shared_model import SharedModel


class CreditCard(SharedModel):
    card_number = db.Column(db.BigInteger, index=True, unique=True)
    card_holder = db.Column(db.Text, index=True)
    cvc = db.Column(db.Integer, index=True)

    mutable_fields = set()
    required_fields = {card_number, cvc, card_holder}
    excluded_fields = set()
