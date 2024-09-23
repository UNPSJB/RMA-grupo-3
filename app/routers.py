from fastapi import APIRouter #, status, Response
from db import conexion
from models import clientes, productos
from schemas import Cliente, Producto
from cryptography.fernet import Fernet
#from starlette.status import HTTP_204_NO_CONTENT # para el Response de arriba

key = Fernet.generate_key()
ocultar = Fernet(key)
cliente = APIRouter()
#producto = APIRouter()

# CLIENTES
@cliente.get("/clientes", response_model=list[Cliente], tags=["clientes"])
def get_clientes():
    return conexion.execute(cliente.select()).fecthall()

@cliente.post("/clientes", response_model=Cliente, tags=["clientes"])
def create_cliente(cliente: Cliente):
    new_cliente = {"name": cliente.nombre, "email": cliente.email}
    new_cliente["password"] = ocultar.encrypt(cliente.password.encode("utf-8"))
    result = conexion.execute(clientes.insert().values(new_cliente))
    return conexion.execute(clientes.select().whre(clientes.c.id == result.lastroid)).first()

@cliente.get("/clientes/{id}", tags=["clientes"])
def get_cliente(id: str):
    return conexion.execute(clientes.select().where(clientes.c.id)).first()

@cliente.delete("/clientes/{id}", tags=["clientes"])#, status_code=status.HTTP_204_NO_CONTENT) #hiria antes del "tags"
def delete_cliente(id: str):
    result = conexion.execute(clientes.delete().where(clientes.c.id == id))
    return "Eliminado" #Response(status_code=HTTP_204_NOT_CONTENT) #para usar esto hay que descomentar el Response de arriba

@cliente.put("/clientes/{id}", response_model=Cliente, tags=["clientes"])
def update_cliente(id: str, cliente: Cliente):
    conexion.execute(cliente.update().values(name = cliente.name, 
                                             email = cliente.email, 
                                             password = ocultar.encrypt(cliente.password.encode("utf-8")))
                                             .where(clientes.c.id == id))
    return conexion.execute(clientes.select().where(clientes.c.id == id)).first() #return "actualizado"

    #PRODUCTOS
@producto.get("/productos", response_model=list[Producto], tags=["productos"])
def get_productos():
    return conexion.execute(producto.select()).fecthall()

@producto.post("/productos", response_model=Producto, tags=["productos"])
def create_producto(producto: Producto):
    new_producto = {"name": producto.nombre, "email": producto.email}
    new_producto["password"] = ocultar.encrypt(producto.password.encode("utf-8"))
    result = conexion.execute(productos.insert().values(new_producto))
    return conexion.execute(productos.select().whre(productos.c.id == result.lastroid)).first()

@producto.get("/productos/{id}", tags=["productos"])
def get_producto(id: str):
    return conexion.execute(productos.select().where(productos.c.id)).first()

@producto.delete("/productos/{id}", tags=["productos"])#, status_code=status.HTTP_204_NO_CONTENT) #hiria antes del "tags"
def delete_producto(id: str):
    result = conexion.execute(productos.delete().where(productos.c.id == id))
    return "Eliminado" #Response(status_code=HTTP_204_NOT_CONTENT) #para usar esto hay que descomentar el Response de arriba

@producto.put("/productos/{id}", response_model=Producto, tags=["productos"])
def update_producto(id: str, producto: Producto):
    conexion.execute(producto.update().values(name = producto.name, 
                                             email = producto.email, 
                                             password = ocultar.encrypt(producto.password.encode("utf-8")))
                                             .where(productos.c.id == id))
    return conexion.execute(productos.select().where(productos.c.id == id)).first() #return "actualizado"