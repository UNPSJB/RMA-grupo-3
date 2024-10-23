from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey#, Date, Time
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship

# Define la URL de la base de datos
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

# Crea el motor
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

# Define Base
Base = declarative_base()


class Usuario(Base):
    __tablename__ = "usuarios"

    dni = Column(String, primary_key=True)  # Cambia a String si el DNI tiene ceros a la izquierda
    nombre = Column(String, nullable=False)
    edad = Column(Integer, nullable=False)

    def __repr__(self):
        return f"<Usuarios(dni={self.dni}, nombre={self.nombre}, edad={self.edad})>"

class Nodo(Base):
    __tablename__ = "nodos"

    id = Column(Integer, primary_key=True, index=True)  
    datosGenerales = relationship("DatosGenerales", back_populates="nodos")
    #temperaturas = relationship("Temperatura", back_populates="nodos")

class DatosGenerales(Base):
    __tablename__ = "datosGenerales"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nodo_id = Column(Integer, ForeignKey("nodos.id"), index=True)
    type = Column(String)
    dato = Column(Float)  
    time = Column(DateTime)

    nodos = relationship("Nodo", back_populates="datosGenerales")

'''
class Temperatura(Base):
    __tablename__ = "temperaturas"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True) #?
    type = Column(String)
    data = Column(String)  
    time = Column(String)
    nodo_id = Column(Integer, ForeignKey("nodos.id"))

    nodo = relationship("Nodo", back_populates="temperaturas")
'''

# Crear las tablas
Base.metadata.create_all(bind=engine)

