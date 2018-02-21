from flask import render_template

from server import app

# --–---------------------
# Templating routes
# --–---------------------
from server.models import User


@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')


@app.route('/about')
def about():
    return render_template('about.html')


@app.route('/users')
def users():
    all_users = User.query.all()
    return render_template('users.html', users=all_users)
