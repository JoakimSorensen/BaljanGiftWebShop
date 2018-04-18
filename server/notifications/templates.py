def order_confirmation_email(order):
    buyer = order.buyer
    receiver = order.receiver
    giftbox = order.giftbox

    subject = "Baljangavan: orderbekräftelse {}".format(order.date)

    message = """Tack för din beställning!

{name}, snart får {receiver_name} ett sms med information om gåvan och sin unika uthämtningskod, ordernumret. Vi mailar dig när hen har hämtat ut den.

Du hittar mer information om din order på http://localhost:5000/order?token={token}.

Du är alltid välkommen att kontakta oss på baljangavan@gmail.com.

Med vänliga hälsningar,
Baljangåvan 🎁
    
   
Din beställning:
Mottagarens namn: {receiver_name}
Mottagarens telefonnummer: {receiver_phone}
Pris: {price}
Gåva: {gift}
Meddelande: {message}
Ordernummer: {token}


""".format(name=buyer.name, receiver_name=receiver.name,
           receiver_phone=receiver.phone,
           price=order.price, gift=giftbox.name, message=order.message,
           token=order.token)

    return subject, message


def status_change_email(order):
    buyer = order.buyer
    receiver = order.receiver

    subject = "Baljangavan: status ändrad för order {}".format(order.token)

    message = """Hej {name}, den beställning du skickat till {receiver_name} har nu ändrat status till "{status}"!

För detaljer kring ordern, gå in på http://localhost:5000/order?token={token}.

Du är alltid välkommen att kontakta oss på baljangavan@gmail.com.


Med vänliga hälsningar,
Baljangåvan 🎁

""".format(status=order.get_status_text(order.status), token=order.token, name=buyer.name, receiver_name=receiver.name)
    return subject, message


def ready_for_delivery_sms(order):
    message = """Goda nyheter!
Du har fått en gåva att hämta i Baljan!  🎁
Ange kod: {token}
    
Ha en kalasbra dag,
Önskar Baljangåvan 🎈""".format(token=order.token)

    return message
