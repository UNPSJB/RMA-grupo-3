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
    user = Column(String, nullable=False, unique=True)  # Cambia a String si el DNI tiene ceros a la izquierda
    password = Column(String, nullable=False)
    
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
    nodo_id = Column(Integer, ForeignKey("nodos.id", ondelete="CASCADE"), index=True)
    type = Column(String, nullable=False)
    dato = Column(Float, nullable=False)
    time = Column(DateTime, nullable=False)

    nodos = relationship("Nodo", back_populates="datosGenerales")


# Crear las tablas
Base.metadata.create_all(bind=engine)

