from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField, ValidationError
from wtforms.validators import DataRequired, Email, EqualTo
from server.models import User


class EditUserForm(FlaskForm):
	username = StringField('Användarnamn')
	email = StringField('Email', validators=[Email()])
	password = PasswordField('Lösenord')
	password2 = PasswordField('Repetera Lösenord', validators=[EqualTo("password")])
	is_admin = BooleanField('Admin')
	submit = SubmitField('Spara')
	
	def validate_username(self, username):
		user = User.query.filter_by(username=username.data).first()
		if user:
			raise ValidationError('Please use a different username.')
	
	
	def validate_email(self, email):
		user = User.query.filter_by(email=email.data).first()
		if user:
			raise ValidationError('Please use a different email.')
