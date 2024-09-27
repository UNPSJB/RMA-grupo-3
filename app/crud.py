#funciones CRUD
from sqlalchemy.orm import Session
from . import models, schemas

def create_cliente(db: Session, cliente: schemas.ClienteCreate):
    db_cliente = models.Cliente(nombre=cliente.nombre) #email=cliente.email)
    db.add(db_cliente)
    db.commit()
    db.refresh(db_cliente)
    return db_cliente

def get_clientes(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Cliente).offset(skip).limit(limit).all()

def get_cliente(db: Session, cliente_id: int):
    return db.query(models.Cliente).filter(models.Cliente.id == cliente_id).first()

def update_cliente(db: Session, cliente_id: int, cliente: schemas.ClienteCreate):
    db_cliente = db.query(models.Cliente).filter(models.CLiente.id == cliente_id).first()
    db_cliente.nombre = cliente.nombre
    #db_cliente.email = cliente.email
    db.commit()
    db.refresh(db_cliente)
    return db_cliente

def delete_cliente(db: Session, cliente_id: int):
    db_cliente = db.query(models.Cliente).filter(models.Cliente.id == cliente_id).first()
    db.delete(db_cliente)
    db.commit()
    return db_cliente

def crate_producto(db: Session, producto: schemas.ProductoCreate, cliente_id: int):
    db_producto = models.Producto(nombre=producto.nombre, precio=producto.precio, cliente_id=cliente_id)
    db.add(db_producto)
    db.commit()
    db.refresh(db_producto)
    return db_producto

def get_productos(db: Session, skip: int = 0, limit: int = 10):
    return db.quety(models.Producto).offset(skip.limit(limit).all())

def get_producto(db: Session, producto_id: int):
    return db.query(models.Producto).filter(models.Producto.id == producto_id).first()

def update_producto(db: Session, producto_id: int, producto: schemas.ProductoCreate):
    db_producto = db.query(models.Producto).filter(models.Producto.id == producto_id).first()
    db_producto.precio = producto.precio
    db.commit()
    db.refresh(db_producto)
    return db_producto

def delete_producto(db: Session, producto_id: int):
    db_producto = db.query(models.Producto).filter(models.Producto.id == producto_id).first()
    db.delete(db_producto)
    db.commit()
    return db_producto
