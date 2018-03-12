import datetime

from flask import jsonify, redirect, request, url_for
from flask_login import current_user, login_required
from server import app
from server.models import Buyer, GiftBox, Receiver, Order, User


@app.route('/api/v1/users')
def all_users():
    users = User.query.all()
    users_dicts = [user.to_dict() for user in users]
    return jsonify(users_dicts)


@app.route('/api/v1/giftbox')
def all_giftboxes():
    giftboxes = GiftBox.query.all()
    giftboxes_dicts = [giftboxes.to_dict() for giftbox in giftboxes]
    return jsonify(giftboxes_dicts)


@app.route('/api/v1/payment_completed/', methods=['GET', 'POST'])
def payment_completed():
    buyer = Buyer.add(name=request.values["name"], email=request.values["stripeEmail"])
    receiver = Receiver.add(name=request.values["rec-name"], phone=request.values["phonenumber"], 
                            liu_id=request.values["liuid"])
    giftbox = GiftBox.query.get(request.values["giftbox"])
    order = Order.add(price=giftbox.price, 
                        giftbox_id = giftbox.id, 
                        date=datetime.datetime.now(), 
                        status=datetime.timedelta(days=14), 
                        buyer_id=buyer.id, 
                        receiver_id=receiver.id)
    return redirect(url_for('order_view', order_id=order.id))
    #return jsonify(dict(request.args))


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

