from server import db
from server.models.shared_model import SharedModel


class BoxContent(SharedModel):
    gift_box = db.Column(db.Text, index=True)
    product = db.Column(db.Text, index=True)

    mutable_fields = {gift_box, product}
    required_fields = {gift_box, product}
    excluded_fields = set()
