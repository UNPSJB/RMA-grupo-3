from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Define la URL de la base de datos
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

# Crea el motor
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

# Define Base
Base = declarative_base()

class Producto(Base):
    __tablename__ = "productos"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    precio = Column(Integer)

class Persona(Base):
    __tablename__ = "personas"

    dni = Column(String, primary_key=True)  # Cambia a String si el DNI tiene ceros a la izquierda
    nombre = Column(String, nullable=False)
    edad = Column(Integer, nullable=False)

    def __repr__(self):
        return f"<Persona(dni={self.dni}, nombre={self.nombre}, edad={self.edad})>"

# Crear las tablas
Base.metadata.create_all(bind=engine)
