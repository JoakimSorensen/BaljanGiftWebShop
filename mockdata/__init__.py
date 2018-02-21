from server.models import User
from utils import load_json_from_relative_path


def create_mock_data():
    _create_admin_users()


def _create_admin_users():
    admin_dicts = load_json_from_relative_path(__file__, 'admins.json')
    for admin_dict in admin_dicts:
        username = admin_dict['username']
        email = admin_dict['email']
        User.add(username=username, email=email)
