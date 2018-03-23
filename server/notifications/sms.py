import requests

from server.notifications.secrets import USERNAME_46ELKS, PASSWORD_46ELKS
from server.notifications.templates import ready_for_delivery_sms


def send_ready_for_delivery_sms(order):
    recipient = order.receiver.phone
    message = ready_for_delivery_sms(order)
    _send_sms(recipient, message, dryrun=True)


def _send_sms(recipient, message, dryrun=False):
    authentication = (USERNAME_46ELKS, PASSWORD_46ELKS)
    data = {
        'from': 'Baljangavan',
        'to': recipient,
        'message': message,
        'dryrun': ""
    }

    if dryrun:
        data["dryrun"] = "yes"
    else:
        data["dryrun"] = "no"

    response = requests.post(
        "https://api.46elks.com/a1/SMS",
        data=data,
        auth=authentication
    )
    if response.status_code is 200:
        if dryrun:
            print("SMS would have been sent successfully! ✅✅✅")
            print(response.text)
        if not dryrun:
            print("SMS was sent successfully! ✅✅✅")
            print(response.text)
    else:
        print("SMS failed to send ❌❌❌")
        print(response.text)


