import mockdata
import data
from server import app


def reset_db():
    from server import db

    # Remove all data and create schemas
    db.reflect()
    db.drop_all()
    db.create_all()

    # Create mock data in the database
    mockdata.create_mock_data()

    # Create data in the database
    data.create_data()


if __name__ == '__main__':
    reset_db()
    app.run(debug=True, use_reloader=True)
