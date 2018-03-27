def order_confirmation_email(order):
    buyer = order.buyer
    receiver = order.receiver
    giftbox = order.giftbox

    subject = "Baljangavan: Orderbekräftelse {}".format(order.date)

    message = """
    Vi har mottagit din beställning! 
    
    Ditt namn: {name}
    Mottagarens namn: {receiver_name}
    Mottagarens LiU ID: {receiver_liu_id}
    Mottagarens telefonnummer: {receiver_phone}
        
    Pris: {price}
    Gåva: {gift}
    Meddelande: {message}
                
    Bekräftelsenummret {token} kommer användas av gåvans mottagare för att hämta ut den i Baljan. 
        
    För att se status på beställningen, gå in på http://localhost:5000/order?token={token}
    """.format(name=buyer.name, receiver_name=receiver.name,
               receiver_liu_id=receiver.liu_id, receiver_phone=receiver.phone,
               price=order.price, gift=giftbox.name, message=order.message,
               token=order.token)

    return subject, message


def status_change_email(order):
    subject = "Baljangavan: Order status {}".format(order.status)

    message = """
    Din beställnings status har ändrats till {status}!

    För detaljer, gå in på http://localhost:5000/order?token={token}
    Vänliga hälsningar,
    Baljangåvan
    """.format(status=order.status, token=order.token)
    return subject, message


def ready_for_delivery_sms(order):
    message = """God nyheter!
    Du har fått en gåva att hämta i Baljan!  🎁
    
    Ange kod: {token}
    
    Med gratulerande hälsningar,
    Baljangåvan  🎈
    """.format(token=order.token)

    return message
