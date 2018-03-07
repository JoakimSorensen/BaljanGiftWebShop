from flask import jsonify, request
from server import app
from server.models import User, GiftBox


@app.route('/api/v1/users')
def all_users():
    users = User.query.all()
    users_dicts = [user.to_dict() for user in users]
    return jsonify(users_dicts)


@app.route('/api/v1/payment_completed/', methods=['GET', 'POST'])
def payment_completed():
    return jsonify(
        {
            "status": "ok",
            "message": "Payment accepted",
            "data": dict(request.args)
        }
    )


@app.route('/api/v1/users/<int:id_>')
def user_with_id(id_):
    user = User.query.get(id_)
    if user is not None:
        return jsonify(user.to_dict())

    return jsonify({"error": "No user with ID: {id_}".format(id_=id_)}), 404

@app.route('/api/v1/giftboxes/<int:id_>')
def giftbox_with_id(id_):
    giftbox = GiftBox.query.get(id_)
    if giftbox is not None:
        return jsonify(giftbox.to_dict())

    return jsonify({"error": "No giftbox with ID: {id_}".format(id_=id_)}), 404


