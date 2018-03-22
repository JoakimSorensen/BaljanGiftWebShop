from flask_mail import Message

from server import mail
from server.notifications.templates import order_confirmation_email


def send_order_confirmation_email(order):
    subject, confirmation_message = order_confirmation_email(order)
    _send_email(confirmation_message, subject, order.buyer.email)


def _send_email(email_body, subject, recipient):
    message = Message(subject, sender="baljangavan@gmail.com", recipients=[recipient])
    message.body = email_body
    mail.send(message)