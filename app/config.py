from app import models
from app.database import engine

def setup_database():
    print("Creando tablas en la base de datos...")
    models.Base.metadata.create_all(bind=engine)
    print("Tablas creadas con éxito.")

if __name__ == "__main__":
    setup_database()
