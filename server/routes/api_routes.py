import datetime
from threading import Thread

from flask import abort, jsonify, redirect, request, url_for, render_template
from flask_login import current_user, logout_user, login_required

from server import app, db
from server.models import Buyer, GiftBox, GiftBoxProduct, Receiver, Order, User, Product
from server.notifications.email import send_order_confirmation_email, send_order_status_change_email
from server.notifications.sms import send_ready_for_delivery_sms


@app.route('/api/v1/users')
def all_users():
    users = User.query.all()
    users_dicts = [user.to_dict() for user in users]
    return jsonify(users_dicts)


@app.route('/api/v1/giftbox')
def all_giftboxes():
    giftboxes = GiftBox.query.all()
    giftboxes_dicts = [giftbox.to_dict() for giftbox in giftboxes]
    return jsonify(giftboxes_dicts)


@app.route('/api/v1/order')
def all_orders():
    orders = Order.query.all()
    orders_dicts = [order.to_dict() for order in orders]
    return jsonify(orders_dicts)


@app.route('/api/v1/payment_completed/', methods=['GET', 'POST'])
def payment_completed():
    receiver_name = request.values["rec-name"]
    receiver_phone = request.values["phonenumber"]

    message = request.values['message']

    receiver = Receiver.create_receiver(receiver_name, receiver_phone)
    buyer = Buyer.add(name=request.values["name"], email=request.values["stripeEmail"])
    giftbox = GiftBox.query.get(request.values["giftbox"])

    order = Order.create_order(giftbox, buyer, receiver, message)
    
    send_order_confirmation_email(order)
    send_ready_for_delivery_sms(order)

    return redirect("/order?token={token}".format(token=order.token))


@app.route('/api/v1/users/<int:id_>')
@app.route('/baljan/api/v1/users/<int:id_>')
def user_with_id(id_):
    user = User.query.get(id_)
    if user is not None:
        return jsonify(user.to_dict())

    return jsonify({"error": "No user with ID: {id_}".format(id_=id_)}), 404


@app.route('/api/v1/giftbox/<int:id_>')
@app.route('/baljan/api/v1/giftbox/<int:id_>')
def giftbox_with_id(id_):
    giftbox = GiftBox.query.get(id_)
    products = db.session.query(Product.name
            ).filter(GiftBoxProduct.gift_box_id==giftbox.id, Product.id==GiftBoxProduct.product_id
                    ).all()
    if giftbox is not None:
        giftbox_dict = giftbox.to_dict()
        print("Products = ", products)
        giftbox_dict["products"]  = products
        return jsonify(giftbox_dict)

    return jsonify({"error": "No giftbox with ID: {id_}".format(id_=id_)}), 404

@app.route('/api/v1/order/<int:id_>')
@app.route('/baljan/api/v1/order/<int:id_>')
def order_with_id(id_):
    order = Order.query.get(id_)
    if order is not None:
        order_dict = order.to_dict()
        return jsonify(order_dict)

    return jsonify({"error": "No order with ID: {id_}".format(id_=id_)}), 404


@app.route('/api/v1/product/<int:id_>')
@app.route('/baljan/api/v1/product/<int:id_>')
def product_with_id(id_):
    product = Product.query.get(id_)
    if product is not None:
        product_dict = product.to_dict()
        return jsonify(product_dict)

    return jsonify({"error": "No product with ID: {id_}".format(id_=id_)}), 404


@app.route('/api/v1/buyer/<int:id_>')
@app.route('/baljan/api/v1/buyer/<int:id_>')
def buyer_with_id(id_):
    buyer = Buyer.query.get(id_)
    if buyer is not None:
        return jsonify(buyer.to_dict())

    return jsonify({"error": "No buyer with ID: {id_}".format(id_=id_)}), 404


@app.route('/api/v1/receiver/<int:id_>')
@app.route('/baljan/api/v1/receiver/<int:id_>')
def receiver_with_id(id_):
    receiver = Receiver.query.get(id_)
    if receiver is not None:
        return jsonify(receiver.to_dict())

    return jsonify({"error": "No receiver with ID: {id_}".format(id_=id_)}), 404


@app.route('/api/v1/order_token/<token>')
@app.route('/baljan/api/v1/order_token/<token>')
def order_with_token(token):
    order = Order.query.filter_by(token=token).first()
    if order is not None:
        order_dict = order.to_dict()
        return jsonify(order_dict)

    return jsonify("error")


@app.route('/api/v1/order_token_formatted_info/<token>')
@app.route('/baljan/api/v1/order_token_formatted_info/<token>')
def order_with_token_formatted_info(token):
    order = Order.query.filter_by(token=token).first()
    if order is not None:
        giftbox = GiftBox.query.filter_by(id=order.giftbox_id).first()
        receiver = Receiver.query.filter_by(id=order.receiver_id).first()

        return jsonify({"giftbox_name": giftbox.name, 
            "receiver_name": receiver.name,
            "receiver_phone": receiver.phone,
            "message": order.message,
            "price": order.price,
            "status": order.status})

    return jsonify("error")


@app.route('/api/v1/check_order_hash/<int:id_>/<token>')
@app.route('/baljan/api/v1/check_order_hash/<int:id_>/<token>')
def check_order_hash(id_, token):
    order = Order.query.get(id_)
    if order is not None:
        if order.check_token(token):
            return jsonify({"matching hash": "order id: {}".format(id_)}), 200
        return jsonify({"error": "no matching hash for order id: {}".format(id_)}), 401
    return jsonify({"error": "No order with ID: {id_}".format(id_=id_)}), 404


@app.route('/api/v1/delete_user', methods=['DELETE'])
@app.route('/baljan/api/v1/delete_user', methods=['DELETE'])
@login_required
def delete_user():
    user_id = request.form.get('id')
    if not int(user_id) == current_user.id:
        User.delete(user_id)
        return "success"
    return abort(403)


@app.route('/api/v1/delete_giftbox', methods=['DELETE'])
@app.route('/baljan/api/v1/delete_giftbox', methods=['DELETE'])
@login_required
def delete_giftbox():
    giftbox_id = request.form.get('id')
    GiftBox.delete(giftbox_id)
    return "success"


@app.route('/api/v1/delete-product-giftbox', methods=['POST'])
@app.route('/baljan/api/v1/delete-product-giftbox', methods=['POST'])
@login_required
def delete_product_from_giftbox():
    giftbox_id = request.form.get('id')
    product_name = request.form.get('name').lower().title()
    product = Product.query.filter_by(name=product_name).first()
    if not product:
        return jsonify("No product with name {}".format(product_name)), 404
    GiftBoxProduct.query.filter_by(gift_box_id=giftbox_id, product_id=product.id).delete()
    db.session.commit()
    return "success"


@app.route('/api/v1/add-product-giftbox', methods=['POST'])
@app.route('/baljan/api/v1/add-product-giftbox', methods=['POST'])
@login_required
def add_product_to_giftbox():
    giftbox_id = request.form.get('id')
    product_name = request.form.get('name').lower().title()
    product = Product.query.filter_by(name=product_name).first()
    if not product:
        return jsonify("No product with name {}".format(product_name)), 404
    giftbox = GiftBoxProduct.add(gift_box_id=giftbox_id, product_id=product.id)
    return "success"


@app.route('/api/v1/delete_order', methods=['DELETE'])
@app.route('/baljan/api/v1/delete_order', methods=['DELETE'])
@login_required
def delete_order():
    order_id = request.form.get('id')
    Order.delete(order_id)
    return "success"


@app.route('/api/v1/delete_product', methods=['DELETE'])
@app.route('/baljan/api/v1/delete_product', methods=['DELETE'])
@login_required
def delete_product():
    product_id = request.form.get('id')
    Product.delete(product_id)
    return "success"


@app.route('/api/v1/delete_buyer', methods=['DELETE'])
@app.route('/baljan/api/v1/delete_buyer', methods=['DELETE'])
@login_required
def delete_buyer():
    buyer_id = request.form.get('id')
    Buyer.delete(buyer_id)
    return "success"


@app.route('/api/v1/delete_receiver', methods=['DELETE'])
@app.route('/baljan/api/v1/delete_receiver', methods=['DELETE'])
@login_required
def delete_receiver():
    receiver_id = request.form.get('id')
    Receiver.delete(receiver_id)
    return "success"


@app.route('/api/v1/edit_user', methods=['GET', 'POST'])
@app.route('/baljan/api/v1/edit_user', methods=['GET', 'POST'])
@login_required
def edit_user():
    if request.method == "POST":
        user_id = request.form.get('id')
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        is_admin = request.form.get('is_admin')
        user = User.query.filter_by(id=user_id).first()
        if username:
            user.set_username(username)
        if email:
            user.set_email(email)
        if password:
            user.set_password(password)
        if is_admin is not None:
            user.set_admin(bool(is_admin))
        return redirect(url_for('admin'))


@app.route('/api/v1/edit_giftbox', methods=['GET', 'POST'])
@app.route('/baljan/api/v1/edit_giftbox', methods=['GET', 'POST'])
@login_required
def edit_giftbox():
    if request.method == "POST":
        giftbox_id = request.form.get('id')
        giftbox_name = request.form.get('name')
        description = request.form.get('description')
        price = request.form.get('price')
        image = request.form.get('image')
        giftbox = GiftBox.query.filter_by(id=giftbox_id).first()
        if giftbox_name:
            giftbox.set_name(giftbox_name)
        if description:
            giftbox.set_description(description)
        if price:
            giftbox.set_price(price)
        if image:
            giftbox.set_image(image)
        return redirect(url_for('admin'))


@app.route('/api/v1/edit_product', methods=['GET', 'POST'])
@app.route('/baljan/api/v1/edit_product', methods=['GET', 'POST'])
@login_required
def edit_product():
    if request.method == "POST":
        product_id = request.form.get('id')
        product_name = request.form.get('name')
        allergen = request.form.get('allergen')
        price = request.form.get('price')
        image = request.form.get('image')
        product = Product.query.filter_by(id=product_id).first()
        if product_name:
            product.set_name(product_name)
        if allergen:
            product.set_allergen(allergen)
        if price:
            product.set_price(price)
        if image:
            product.set_image(image)
        return redirect(url_for('admin'))


@app.route('/api/v1/edit_buyer', methods=['GET', 'POST'])
@app.route('/baljan/api/v1/edit_buyer', methods=['GET', 'POST'])
@login_required
def edit_buyer():
    if request.method == "POST":
        buyer_id = request.form.get('id')
        buyer_name = request.form.get('name')
        email = request.form.get('email')
        buyer = Buyer.query.filter_by(id=buyer_id).first()
        if buyer_name:
            buyer.set_name(buyer_name)
        if email:
            buyer.set_email(email)
        return redirect(url_for('admin'))


@app.route('/api/v1/edit_receiver', methods=['GET', 'POST'])
@app.route('/baljan/api/v1/edit_receiver', methods=['GET', 'POST'])
@login_required
def edit_receiver():
    if request.method == "POST":
        receiver_id = request.form.get('id')
        receiver_name = request.form.get('name')
        receiver_phone = request.form.get('phone')
        receiver = Receiver.query.filter_by(id=receiver_id).first()
        if receiver_name:
            receiver.set_name(receiver_name)
        if receiver_phone:
            receiver.set_phone(receiver_phone)
        return redirect(url_for('admin'))


@app.route('/api/v1/edit_order', methods=['GET', 'POST'])
@app.route('/baljan/api/v1/edit_order', methods=['GET', 'POST'])
@login_required
def edit_order():
    if request.method == "POST":
        order_id = request.form.get('id')
        buyer = request.form.get('buyer')
        buyer_id = request.form.get('buyer_id')
        price = request.form.get('price')
        date = datetime.datetime.strptime(request.form.get('date'), "%a %b %d %H:%M:%S %Y")
        status = request.form.get('status_')
        receiver = request.form.get('receiver')
        receiver_id = request.form.get('receiver_id')
        giftbox = request.form.get('giftbox')
        giftbox_id = request.form.get('giftbox_id')
        message = request.form.get('message')

        order = Order.query.filter_by(id=order_id).first()
        if buyer_id:
            order.set_buyer(buyer_id)
        if receiver_id:
            order.set_receiver(receiver_id)
        if price:
            order.set_price(price)
        if date:
            order.set_date(date)
        if status:
            order.set_status(status)
        if giftbox_id:
            order.set_giftbox(giftbox_id)
        if message:
            order.set_message(message)
        return redirect(url_for('admin'))


@app.route('/api/v1/add_user', methods=['POST'])
@app.route('/baljan/api/v1/add_user', methods=['POST'])
@login_required
def add_user():
    if request.method == "POST":
        username = request.form.get('username')
        email = request.form.get('email')
        is_admin = request.form.get('is_admin')
        password = request.form.get('password')

        user = User.add(username=username, email=email, is_admin=bool(is_admin))

        if user:
            if password:
                user.set_password(password)
            return jsonify("success"), 200 
        return jsonify({"error": "Could not create user"}), 500


@app.route('/api/v1/add_giftbox', methods=['POST'])
@app.route('/baljan/api/v1/add_giftbox', methods=['POST'])
@login_required
def add_giftbox():
    if request.method == "POST":
        description = request.form.get('description')
        price = request.form.get('price')
        name = request.form.get('name')
        image = request.form.get('image')

        giftbox = GiftBox.add(description=description, price=price, name=name, image=image)

        if giftbox:
            return jsonify("success"), 200 
        return jsonify({"error": "Could not create giftbox"}), 500


@app.route('/api/v1/add_product', methods=['POST'])
@app.route('/baljan/api/v1/add_product', methods=['POST'])
@login_required
def add_product():
    if request.method == "POST":
        allergen = request.form.get('allergen')
        price = request.form.get('price')
        name = request.form.get('name')
        image = request.form.get('image')

        product = Product.add(allergen=allergen, price=price, name=name, image=image)

        if product:
            return jsonify("success"), 200 
        return jsonify({"error": "Could not create product"}), 500


@app.route('/api/v1/add_buyer', methods=['POST'])
@app.route('/baljan/api/v1/add_buyer', methods=['POST'])
@login_required
def add_buyer():
    if request.method == "POST":
        name = request.form.get('name')
        email = request.form.get('email')

        buyer = Buyer.add(name=name, email=email)

        if buyer:
            return jsonify("success"), 200 
        return jsonify({"error": "Could not create buyer"}), 500


@app.route('/api/v1/add_receiver', methods=['POST'])
@app.route('/baljan/api/v1/add_receiver', methods=['POST'])
@login_required
def add_receiver():
    if request.method == "POST":
        name = request.form.get('name')
        phone = request.form.get('phone')

        receiver = Receiver.add(name=name, phone=phone)

        if receiver:
            return jsonify("success"), 200 
        return jsonify({"error": "Could not create receiver"}), 500


@app.route('/api/v1/add_order', methods=['POST'])
@app.route('/baljan/api/v1/add_order', methods=['POST'])
@login_required
def add_order():
    if request.method == "POST":
        buyer = Buyer.query.filter_by(id=request.form.get('buyer_id')).first()
        price = request.form.get('price')
        date = request.form.get('date')
        status = request.form.get('status_')
        receiver = Receiver.query.filter_by(id=request.form.get('receiver_id')).first()
        giftbox = GiftBox.query.filter_by(id=request.form.get('giftbox_id')).first()
        message = request.form.get('message')

        if not date:
            date = datetime.datetime.now()
        else:
            date = datetime.datetime.strptime(date, "%a %b %d %H:%M:%S %Y")

        order = Order.create_order(giftbox, buyer, receiver, message)
        
        if status:
           order.set_status(status)
        if order:
            return jsonify("success"), 200 
        return jsonify({"error": "Could not create order"}), 500


@app.route('/api/v1/change_status/<int:order_id>', methods=['POST'])
@app.route('/baljan/api/v1/change_status/<int:order_id>', methods=['POST'])
@login_required
def change_status(order_id):
    statuses = ['processing', 'preparing', 'received']
    order = Order.query.filter_by(id=order_id).first()
    for i in range(len(statuses)):
        if order.status == statuses[i]:
            if i < 2:
                order.set_status(statuses[i + 1])
            else:
                order.set_status(statuses[0])
            return "success"
    return jsonify({"error": "could not set status on order = {}".format(order.id)}), 500


@app.route('/api/v1/notify-buyer-status/<int:order_id>')
@app.route('/baljan/api/v1/notify-buyer-status/<int:order_id>')
@login_required
def notify_buyer_status(order_id):
    order = Order.query.filter_by(id=order_id).first()
    if order:
        send_order_status_change_email(order)
        return "Status change email sent to email {}".format(order.buyer.email), 200
    return "No order with id = {} was found!".format(order_id), 404


@app.route('/api/v1/logout')
def logout_admin():
    """
    Logout the current_user,
    used for administrator.
    """
    logout_user()
    return redirect('/')

