from flask import abort, render_template, redirect, request, url_for
from flask_login import current_user, login_user, login_required
from werkzeug.urls import url_parse

from server import app

# --–---------------------
# Templating routes
# --–---------------------
from server.forms import AdminLoginForm, RegistrationForm
from server.models import User, Order, GiftBox, GiftBoxProduct, Product, Receiver, Buyer


@app.route('/baljan', defaults={'path': ''})
@app.route('/baljan/<path:path>')
@login_required
def admin(path):
    return render_template('base.html')


@app.route('/admin-welcome')
@login_required
def admin_welcome():
    return render_template('admin.html')


@app.route('/admin-users')
@login_required
def admin_users():
    all_users = User.query.all()
    return render_template('users.html', users=all_users)


@app.route('/admin-giftboxs')
@login_required
def admin_giftboxs():
    all_giftbox = GiftBox.query.all()
    all_products = Product.query.all()
    return render_template('admin_giftbox.html', giftboxs=all_giftbox, products=all_products)


@app.route('/admin-orders')
@login_required
def admin_orders():
    all_orders = Order.query.all()
    return render_template('admin_order.html', orders=all_orders)


@app.route('/admin-products')
@login_required
def admin_products():
    all_products = Product.query.all()
    return render_template('admin_products.html', products=all_products)


@app.route('/admin-buyers')
@login_required
def admin_buyers():
    all_buyers = Buyer.query.all()
    return render_template('admin_buyer.html', buyers=all_buyers)


@app.route('/admin-receivers')
@login_required
def admin_receivers():
    all_receivers = Receiver.query.all()
    return render_template('admin_receiver.html', receivers=all_receivers)


@app.route('/login', methods=['GET', 'POST'])
def login():
    """
    Login function to login
    administrator. Requires
    admin rights, i.e. the field
    is_admin in User to be True.
    """
    if current_user.is_authenticated:
        return redirect(url_for('admin'))

    form = AdminLoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.username.data).first()

        if not user:
            user = User.query.filter_by(username=form.username.data).first()

        if not user or not user.check_password(form.password.data):
            # flash('Invalid username or password')
            abort(401)
            return render_template('adminlogin.html', title='Sign In', form=form)
        elif not user.is_admin:
            abort(401)
        login_user(user, remember=form.remember_me.data)
        next_page = request.args.get('next')

        if not next_page or url_parse(next_page).netloc != '':
            next_page = url_for('admin')
        return redirect(next_page)
    return render_template('adminlogin.html', title='Sign In', form=form)
