from flask import Flask
from flask_sqlalchemy import SQLAlchemy

from config import Config

app = Flask(__name__)
app.jinja_env.auto_reload = True
app.config.from_object(Config)
db = SQLAlchemy(app)


from server import routes, models
