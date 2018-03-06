from flask import abort, render_template, redirect, request, url_for
from flask_login import current_user, login_user, logout_user, login_required
from werkzeug.urls import url_parse

from server import app

# --–---------------------
# Templating routes
# --–---------------------
from server.forms import AdminLoginForm, EditUserForm, RegistrationForm
from server.models import User
from server.models import User, Product, GiftBox


@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')


@app.route('/about')
def about():
    return render_template('about.html')


@app.route('/users')
def users():
    all_users = User.query.all()
    return render_template('users.html', users=all_users)


@app.route('/admin')
@login_required
def admin():
    """
    The start page for admin,
    requires login and returns
    the html admin.html.
    """
    return render_template('admin.html')


@app.route('/admin-users')
@login_required
def admin_users():
    """
    Returns a list of all
    user in user.html.
    """
    all_users = User.query.all()
    return render_template('users.html', users=all_users)


@app.route('/admin-giftboxs')
@login_required
def amdin_giftboxs():
    """
    Returns a list of all
    giftbox in admin_gigiftbox.html.
    """
    all_giftbox = GiftBox.query.all()
    return render_template('admin_giftbox.html', giftboxs=all_giftbox)


@app.route('/add_user', methods=['GET', 'POST'])
@login_required
def add_user():
    form = RegistrationForm()
    print("user_id = ", user_id)
    if form.validate_on_submit():
        user = User.add(username=form.username.data, email=form.email.data, is_admin=form.is_admin.data)
        user.set_password(form.password.data)
        return redirect(url_for('admin'))
    return render_template('edituser.html', form=form)


@app.route('/edit_user', methods=['GET', 'POST'])
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
    return render_template('edituser.html', form=form)


@app.route('/delete_user', methods=['DELETE'])
@login_required
def delete_user():
    user_id = request.form.get('id')
    if not int(user_id) == current_user.id:
        User.delete(user_id)
        return "success"
    return abort(403)


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
            next_page = url_for('index')
        return redirect(next_page)
    return render_template('adminlogin.html', title='Sign In', form=form)


@app.route('/logout')
def logout_admin():
    """
    Logout the current_user,
    used for administrator.
    """
    logout_user()
    return redirect(url_for('index'))


@app.route('/products')
def products():
    all_giftboxes = GiftBox.query.all()

    return render_template('products.html', GiftBoxes=all_giftboxes)


@app.route('/card/<int:gift_box_id>')
def card(gift_box_id):
    gift_box = GiftBox.query.get(gift_box_id)
    return render_template('card.html', gift_box=gift_box)



@app.route('/faq')
def faq():
    return render_template('faq.html')


@app.route('/contact')
def contact():
    return render_template('contact.html')


@app.route('/guide')
def guide():
    return render_template('guide.html')


#--------------------------------------#
#----------- Error Handlers -----------#
#--------------------------------------#
@app.errorhandler(401)
def page_not_found(error):
    """
    Custom view for unauthorized 401.
    Returns the 401-unauth.html.
    """
    return render_template('401-unauth.html'), 401


@app.errorhandler(403)
def forbidden(error):
    """
    Custom view for forbidden 403.
    Returns the 403-forbidden.html.
    """
    return render_template('403-forbidden.html'), 403

