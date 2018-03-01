from flask import Flask
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from flask_wtf import CSRFProtect

from config import Config

app = Flask(__name__)
app.jinja_env.auto_reload = True
app.config.from_object(Config)
db = SQLAlchemy(app)

login = LoginManager(app)
login.login_view = 'login'

csrf = CSRFProtect()
csrf.init_app(app)

from server import routes, models
