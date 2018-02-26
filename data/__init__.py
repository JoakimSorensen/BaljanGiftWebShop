from server.models import Product
from server.models import GiftBox
from server.models import CreditCard
from server.models import BoxContent
from server.models import Payment
from utils import load_json_from_relative_path


def create_data():
    _create_products()
    _create_gift_boxes()
    _create_credit_card()
    _create_box_content()


def _create_products():
    product_dicts = load_json_from_relative_path(__file__, 'products.json')
    for product_dict in product_dicts:
        id = product_dict['id']
        name = product_dict['name']
        price = product_dict['price']
        allergen = product_dict['allergen']
        image = product_dict['image']
        Product.add(id=id, name=name, price=price, allergen=allergen, image=image)


def _create_gift_boxes():
    boxes_dicts = load_json_from_relative_path(__file__, 'gift_boxes.json')
    for box_dict in boxes_dicts:
        id = box_dict['id']
        name = box_dict['name']
        price = box_dict['price']
        description = box_dict['description']
        image = box_dict['image']
        GiftBox.add(id=id, name=name, price=price, description=description, image=image)


def _create_credit_card():
    card_dicts = load_json_from_relative_path(__file__, 'credit_cards.json')
    for card_dict in card_dicts:
        card_number = card_dict['card_number']
        card_holder = card_dict['card_holder']
        cvc = card_dict['cvc']
        CreditCard.add(card_number=card_number, card_holder=card_holder, cvc=cvc)


def _create_box_content():
    content_dicts = load_json_from_relative_path(__file__, 'box_contents.json')
    for content_dict in content_dicts:
        gift_box = content_dict['gift_box']
        product = content_dict['product']
        BoxContent.add(gift_box=gift_box, product=product)


def _create_payment():
    payment_dicts = load_json_from_relative_path(__file__, 'payments.json')
    for payment_dict in payment_dicts:
        id = payment_dict['id']
        time = payment_dict['time']
        credit_card = payment_dict['credit_card']
        swish_nr = payment_dict['swish_nr']
        Payment.add(id=id, time=time, credit_card=credit_card, swish_nr=swish_nr)
