from server import db
from server.models.shared_model import SharedModel


class Payment(SharedModel):
    id = db.Column(db.Text, index=True, primary_key=True)
    time = db.Column(db.Text, index=True)
    credit_card = db.Column(db.BigInteger)
    swish_nr = db.Column(db.BigInteger)
    order = db.column(db.Integer)

    mutable_fields = set()
    required_fields = {id, time, order}
    excluded_fields = set()
