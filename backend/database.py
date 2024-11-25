from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey, Boolean#, Date, Time
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

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user = Column(String, nullable=False, unique=True)  
    password = Column(String, nullable=False)
    """ email = Column(String, unique=True, nullable=False) """
    rol = Column(String, nullable=False) 
    estado = Column(Boolean, default=True)  # Estado del usuario (activo o inactivo)

    
    def __repr__(self):
        return f"<Usuario(user={self.user})>"


class Nodo(Base):
    __tablename__ = "nodos"

    id = Column(Integer, primary_key=True, index=True)
    latitud = Column(Float)  # Columna para latitud
    longitud = Column(Float)  # Columna para longitud
    alias = Column(String, nullable=True)  # Alias del nodo (opcional)
    descripcion = Column(String, nullable=True)  # Descripción del nodo
    estado = Column(Boolean, default=True)  # Estado del nodo (activo o inactivo)

    datosGenerales = relationship("DatosGenerales", back_populates="nodos")

class DatosGenerales(Base):
    __tablename__ = "datosGenerales"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nodo_id = Column(Integer, ForeignKey("nodos.id"), index=True)
    type = Column(String)
    dato = Column(Float)  
    time = Column(DateTime)

    nodos = relationship("Nodo", back_populates="datosGenerales")

# Crear las tablas
Base.metadata.create_all(bind=engine)

