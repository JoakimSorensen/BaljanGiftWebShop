def order_confirmation_email(order):
    buyer = order.buyer
    receiver = order.receiver
    giftbox = order.giftbox

    subject = "Baljangavan: Order confirmation, {}".format(order.date)

    message = """ We have received your order! 
        Your name: {name}
        Receiver's name: {receiver_name}
        Receiver's LiU ID: {receiver_liu_id}
        Receiver's phone: {receiver_phone}
        Price: {price}
        Gift: {gift}
        Message: {message}
        Status: {status} 
        You can use the token below to see current status
        Token: {token}
        """.format(name=buyer.name, receiver_name=receiver.name,
                   receiver_liu_id=receiver.liu_id, receiver_phone=receiver.phone,
                   price=order.price, gift=giftbox.name, message=order.message,
                   status=order.status, token=order.token)

    return subject, message


def ready_for_delivery_sms(order):
    message = """God nyheter!
    Du har fått en gåva att hämta i Baljan!  🎁
    
    Ange kod: {token}
    
    Med gratulerande hälsningar,
    Baljangåvan  🎈
    """.format(token=order.token)

    return message
