from flask import render_template, request

from server import app
from server.models import Order, GiftBox

import stripe

pub_key = 'pk_test_tA2Aq6pmnwXZvAwayRaPnFKm'
secret_key = 'sk_test_4qrht4gf2vgrO3AeirBd7H7W'

stripe.api_key = secret_key

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def base(path):
    # This is a special route which will respond to all requests, except those matching an other defined route
    return render_template('base.html')


@app.route('/html/products')
def products():
    all_giftboxes = GiftBox.query.order_by('price').all()

    return render_template('products.html', GiftBoxes=all_giftboxes)


@app.route('/html/index')
def index():
    return render_template('index.html')


@app.route('/html/card/<int:gift_box_id>')
def card(gift_box_id):
    gift_box = GiftBox.query.get(gift_box_id)
    return render_template('card.html', gift_box=gift_box, pub_key=pub_key)


@app.route('/html/order/<int:order_id>')
def order_view(order_id):
    order = Order.query.get(order_id)
    return render_template('order.html', order=order)


@app.route('/html/order')
def order_view_from_hash():
    token = request.args.get('token')
    # Fetch order from token
    order = Order.query.filter_by(token=token).first()
    if order is None:
        return render_template('token_not_found.html')

    return render_template('order.html', order=order)


@app.route('/html/faq')
def faq():
    return render_template('faq.html')


@app.route('/html/about')
def about():
    return render_template('about.html')


@app.route('/html/contact')
def contact():
    return render_template('contact.html')


@app.route('/html/guide')
def guide():
    return render_template('guide.html')


@app.route('/html/order_info')
def order_info():
    return render_template('order_info.html')
