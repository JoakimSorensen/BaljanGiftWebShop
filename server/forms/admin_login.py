from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import DataRequired


class AdminLoginForm(FlaskForm):
    username = StringField('Användarnamn eller e-post', validators=[DataRequired()])
    password = PasswordField('Lösenord', validators=[DataRequired()])
    remember_me = BooleanField('Kom ihåg')
    submit = SubmitField('Logga in')
