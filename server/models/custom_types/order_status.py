import enum


class OrderStatus(enum.Enum):
    NOTIFIED = 0
    PREPARING = 1
    RECEIVED = 2
    CANCELED = 3

