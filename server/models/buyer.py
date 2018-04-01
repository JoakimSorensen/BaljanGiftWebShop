from server import db
from server.models.shared_model import SharedModel


class Buyer(SharedModel):
    email = db.Column(db.Text, index=True)
    name = db.Column(db.Text, index=True)

    mutable_fields = set()
    required_fields = {email, name}
    excluded_fields = set()

    def __repr__(self):
        return self.name

    def set_email(self, email):
        self.email = email
        db.session.commit()

    def set_name(self, name):
        self.name = name
        db.session.commit()
