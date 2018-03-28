from flask import render_template, request

from server import app
from server.models import Order, GiftBox


@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')


@app.route('/products')
def products():
    all_giftboxes = GiftBox.query.order_by('price').all()

    return render_template('products.html', GiftBoxes=all_giftboxes)


@app.route('/card/<int:gift_box_id>')
def card(gift_box_id):
    gift_box = GiftBox.query.get(gift_box_id)
    return render_template('card.html', gift_box=gift_box)


@app.route('/order/<int:order_id>')
def order_view(order_id):
    order = Order.query.get(order_id)
    return render_template('order.html', order=order)


@app.route('/order')
def order_view_from_hash():
    token = request.args.get('token')
    # Fetch order from token
    order = Order.query.filter_by(token=token).first()
    if order is None:
        return render_template('token_not_found.html')

    return render_template('order.html', order=order)


@app.route('/faq')
def faq():
    return render_template('faq.html')


@app.route('/contact')
def contact():
    return render_template('contact.html')


@app.route('/guide')
def guide():
    return render_template('guide.html')


@app.route('/order_info')
def order_info():
    return render_template('order_info.html')
