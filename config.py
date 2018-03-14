import os
basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):

    # TODO: Never ever ever ever ever store secrets in source code
    SECRET_KEY = os.environ.get('SECRET_KEY') or \
                 '\xa9g\x83\x8b\x0b\x16\xb8\xde\x89L\xbb\x82\x1f\xe4\xae!\xbf\x8b\xecd\xfeC\xb3\x94'

    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///' + os.path.join(basedir, 'app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    TEMPLATES_AUTO_RELOAD = True

    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 465
    MAIL_USERNAME = 'baljangavan@gmail.com'
    MAIL_PASSWORD = 'PasswordForBaljanGavan'
    MAIL_USE_TLS = False
    MAIL_USE_SSL = True
