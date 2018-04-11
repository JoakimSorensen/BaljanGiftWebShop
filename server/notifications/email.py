from flask_mail import Message
from threading import Thread

from server import app
from server import mail
from server.notifications.templates import order_confirmation_email, status_change_email


def send_order_confirmation_email(order):
    subject, confirmation_message = order_confirmation_email(order)
    thread = Thread(target=_send_email, args=[confirmation_message, subject, order.buyer.email])
    thread.start()


def send_order_status_change_email(order):
    subject, status_change_message = status_change_email(order)
    thread = Thread(target=_send_email, args=[status_change_message, subject, order.buyer.email])
    thread.start()


def _send_email(email_body, subject, recipient):
    with app.app_context():
        message = Message(subject, sender="baljangavan@gmail.com", recipients=[recipient])
        message.body = email_body
        mail.send(message)

