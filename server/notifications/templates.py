def order_confirmation_email(order):
    buyer = order.buyer
    receiver = order.receiver
    giftbox = order.giftbox

    subject = "Baljangavan: orderbekräftelse {}".format(order.date)

    message = """<p>Tack för din beställning {name}!

<br><br>Snart får {receiver_name} ett sms med information om gåvan och sin unika uthämtningskod, ordernumret. Vi mailar dig när hen har hämtat ut den.

<br><br>Du hittar mer information om din order, med ordernummer {token}, på http://localhost:5000/order_info.

<br><br>Du är alltid välkommen att kontakta oss på baljangavan@gmail.com.

<br><br>Med vänliga hälsningar,</p>
    
<img src='https://i.gyazo.com/e48febb2c8cc0180861242c7f8d15270.png' style='height: 50px; width: 150px'>
   
<br><br><br><p>Din beställning:
<br>Mottagarens namn: {receiver_name}
<br>Mottagarens telefonnummer: {receiver_phone}
<br>Pris: {price}
<br>Gåva: {gift}
<br>Meddelande: {message}
<br>Ordernummer: {token}</p>


""".format(name=buyer.name, receiver_name=receiver.name,
           receiver_phone=receiver.phone,
           price=order.price, gift=giftbox.name, message=order.message,
           token=order.token)

    return subject, message


def status_change_email(order):
    buyer = order.buyer
    receiver = order.receiver

    subject = "Baljangavan: status ändrad för order {}".format(order.token)

    message = """<p>Hej {name}, den beställning du skickat till {receiver_name} har nu ändrat status till "{status}"!

<br><br>För detaljer kring ordern, fyll i ordernumret, {token}, på http://localhost:5000/order_info.

<br><br>Du är alltid välkommen att kontakta oss på baljangavan@gmail.com.


<br><br><br>Med vänliga hälsningar,</p>

<img src='https://i.gyazo.com/e48febb2c8cc0180861242c7f8d15270.png' style='height: 50px; width: 150px'>

""".format(status=order.get_status_text(order.status), token=order.token, name=buyer.name, receiver_name=receiver.name)
    return subject, message


def ready_for_delivery_sms(order):
    message = """Goda nyheter!
Du har fått en gåva att hämta i Baljan!  🎁
Ange kod: {token}
    
Ha en kalasbra dag,
Önskar Baljangåvan 🎈""".format(token=order.token)

    return message
