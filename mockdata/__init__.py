from server.models import Receiver, Buyer, Order
from server.models.user import User
from server.models.product import Product
from server.models.gift_box import GiftBox, GiftBoxProduct
from utils import load_json_from_relative_path


def create_mock_data():
    _create_admin_users()
    _create_products()
    _create_gift_boxes()
    _create_orders()


def _create_admin_users():
    admin_dicts = load_json_from_relative_path(__file__, 'admins.json')
    for admin_dict in admin_dicts:
        username = admin_dict['username']
        email = admin_dict['email']
        password = admin_dict['password']
        user = User.add(username=username, email=email)
        user.set_password(password)
        if username == "joakim":
            user.set_admin(True)


def _create_products():
    product_dicts = load_json_from_relative_path(__file__, 'products.json')
    for product_dict in product_dicts:
        name = product_dict['name']
        price = product_dict['price']
        allergen = product_dict['allergen']
        image = product_dict['image']
        Product.add(name=name, price=price, allergen=allergen, image=image)


def _create_gift_boxes():
    boxes_dicts = load_json_from_relative_path(__file__, 'gift_boxes.json')
    for box_dict in boxes_dicts:
        name = box_dict['name']
        price = box_dict['price']
        description = box_dict['description']
        image = box_dict['image']

        product_names = box_dict["products"]
        included_products = Product.query.filter(Product.name.in_(product_names)).all()

        gift_box = GiftBox.add(name=name, price=price, description=description, image=image)
        for product in included_products:
            GiftBoxProduct.add(gift_box_id=gift_box.id, product_id=product.id)


def _create_orders():
    orders_dicts = load_json_from_relative_path(__file__, 'orders.json')
    for order_dict in orders_dicts:
        receiver_name = order_dict["receiver"]["name"]
        receiver_phone = order_dict["receiver"]["phone"]
        buyer_name = order_dict["buyer"]["name"]
        buyer_email = order_dict["buyer"]["email"]
        giftbox_id = order_dict["giftbox_id"]
        message = order_dict["message"]

        receiver = Receiver.create_receiver(receiver_name, receiver_phone)
        buyer = Buyer.add(name=buyer_name, email=buyer_email)
        giftbox = GiftBox.query.get(giftbox_id)

        order = Order.create_order(giftbox, buyer, receiver, message)
        print("ℹ️: Mock Order created with token {token}".format(token=order.token))
