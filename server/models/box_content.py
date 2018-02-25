from server import db
from server.models.shared_model import SharedModel


class BoxContent(SharedModel):
    id = db.CompositeIdField('gifbox', 'product')  # är detta rätt sätt att sätta pk till två attribut?
    gift_box = db.Column(db.Text, index=True)  # Hur sätter jag fk.s??
    product = db.Column(db.Text, index=True)

    mutable_fields = {gift_box, product}
    required_fields = {id, gift_box, product}
    excluded_fields = set()