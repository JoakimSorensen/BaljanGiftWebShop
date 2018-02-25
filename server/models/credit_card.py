from server import db
from server.models.shared_model import SharedModel


class CreditCard(SharedModel):
    card_number = db.Column(db.Text, index=True, unique=True)
    cvc = db.Column(db.Integer, index=True)
    card_holder = db.column(db.Text, index=True)

    mutable_fields = set()
    required_fields = {card_number, cvc, card_holder}
    excluded_fields = set()