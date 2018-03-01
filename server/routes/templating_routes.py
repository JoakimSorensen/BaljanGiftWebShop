from flask import abort, render_template, redirect, request, url_for
from flask_login import current_user, login_user, logout_user, login_required
from werkzeug.urls import url_parse

from server import app

# --–---------------------
# Templating routes
# --–---------------------
from server.forms import AdminLoginForm, EditUserForm, RegistrationForm
from server.models import User


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


@app.route('/admin', methods=['GET', 'POST'])
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


@app.route('/edit_user', methods=['GET', 'POST'])
@login_required
def edit_user():
    form = EditUserForm()
    print(form.errors)

    if form.is_submitted():
        print("submitted")
    if form.validate():
        print("valid")
    print(form.errors)
    
    print("yahuuu")
    print("Request method: ", request.method, "\nRequest args: ", request.args)
    if request.method == "POST":
        user = User.query.filter_by(id=request.args.get('id')).first()
        print("user_id = ", user.id)
        if form.validate_on_submit():
            print("in on validate")
            if form.username.data: 
                print("change username")
                user.set_username(form.username.data)
            if form.email.data: 
                print("change email")
                user.set_email(form.email.data)
            if form.password.data: 
                print("change password")
                user.set_password(form.password.data)
            user.set_admin(form.is_admin.data)
            return redirect(url_for('admin'))
    return render_template('edituser.html', form=form)


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
    return render_template('products.html')


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

