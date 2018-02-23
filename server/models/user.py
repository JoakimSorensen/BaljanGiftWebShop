from flask_login import UserMixin
from server import db, login
from server.models.shared_model import SharedModel
from werkzeug.security import generate_password_hash, check_password_hash


@login.user_loader
def get_user(ident):
    return User.query.get(int(ident))


class User(UserMixin, SharedModel):
    username = db.Column(db.Text, index=True, unique=True)
    email = db.Column(db.Text, index=True, unique=True)
    password_hash = db.Column(db.Text)
    is_admin = db.Column(db.Boolean, default=False)

    mutable_fields = {password_hash, is_admin}
    required_fields = {username, email}
    excluded_fields = {password_hash}

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
