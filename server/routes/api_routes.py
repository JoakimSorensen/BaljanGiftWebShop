import datetime

from flask import abort, jsonify, redirect, request, url_for
from flask_login import current_user, logout_user, login_required

from server import app
from server.models import Buyer, GiftBox, Receiver, Order, User
from server.notifications.email import send_order_confirmation_email
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
    receiver_liu_id = request.values["liuid"]

    message = request.values['message']

    receiver = Receiver.create_receiver(receiver_name, receiver_phone, receiver_liu_id)
    buyer = Buyer.add(name=request.values["name"], email=request.values["stripeEmail"])
    giftbox = GiftBox.query.get(request.values["giftbox"])

    order = Order.create_order(giftbox, buyer, receiver, message)

    send_order_confirmation_email(order)
    send_ready_for_delivery_sms(order)

    return redirect(url_for('order_view', order_id=order.id))


@app.route('/api/v1/users/<int:id_>')
def user_with_id(id_):
    user = User.query.get(id_)
    if user is not None:
        return jsonify(user.to_dict())

    return jsonify({"error": "No user with ID: {id_}".format(id_=id_)}), 404


@app.route('/api/v1/giftbox/<int:id_>')
def giftbox_with_id(id_):
    giftbox = GiftBox.query.get(id_)
    if giftbox is not None:
        return jsonify(giftbox.to_dict())

    return jsonify({"error": "No giftbox with ID: {id_}".format(id_=id_)}), 404


@app.route('/api/v1/order/<int:id_>')
def order_with_id(id_):
    order = Order.query.get(id_)
    if order is not None:
        order_dict = order.to_dict()
        return jsonify(order_dict)

    return jsonify({"error": "No order with ID: {id_}".format(id_=id_)}), 404


@app.route('/api/v1/order_token/<token>')
def order_with_token(token):
    order = Order.query.filter_by(token=token).first()
    if order is not None:
        order_dict = order.to_dict()
        return jsonify(order_dict)

    return jsonify({"error": "No order with token: {}".format(token)}), 404


@app.route('/api/v1/check_order_hash/<int:id_>/<token>')
def check_order_hash(id_, token):
    order = Order.query.get(id_)
    if order is not None:
        if order.check_token(token):
            return jsonify({"matching hash": "order id: {}".format(id_)}), 200
        return jsonify({"error": "no matching hash for order id: {}".format(id_)}), 401
    return jsonify({"error": "No order with ID: {id_}".format(id_=id_)}), 404


@app.route('/api/v1/delete_user', methods=['DELETE'])
@login_required
def delete_user():
    user_id = request.form.get('id')
    if not int(user_id) == current_user.id:
        User.delete(user_id)
        return "success"
    return abort(403)


@app.route('/api/v1/delete_giftbox', methods=['DELETE'])
@login_required
def delete_giftbox():
    giftbox_id = request.form.get('id')
    GiftBox.delete(giftbox_id)
    return "success"


@app.route('/api/v1/delete_order', methods=['DELETE'])
@login_required
def delete_order():
    order_id = request.form.get('id')
    Order.delete(order_id)
    return "success"


@app.route('/api/v1/edit_user', methods=['GET', 'POST'])
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


@app.route('/api/v1/edit_order', methods=['GET', 'POST'])
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


@app.route('/api/v1/add_giftbox', methods=['POST'])
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


@app.route('/api/v1/add_order', methods=['POST'])
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
            return jsonify({"success": "status set to {}".format(order.status)}), 200
    return jsonify({"error": "could not set status on order = {}".format(order.id)}), 500


@app.route('/api/v1/logout')
def logout_admin():
    """
    Logout the current_user,
    used for administrator.
    """
    logout_user()
    return jsonify("success"), 200

