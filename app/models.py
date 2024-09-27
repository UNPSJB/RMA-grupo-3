# Definición de las tablas
from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class Cliente(Base):
    __tablename__ = "clientes"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    #email = Column(String, unique=True, index=True)

    productos = relationship("Producto", back_populates="cliente")

class Producto(Base):
    __tablename__ = "productos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    precio = Column(Float)
    cliente_id = Column(Integer, ForeignKey("clientes.id"))  # Clave foránea añadida

    cliente = relationship("Cliente", back_populates="productos")


