#Crear los esquemas Pydantic
from pydantic import BaseModel
from typing import List, Optional

class ProductoBase(BaseModel):
    nombre: str
    precio: float

class ProductoCreate(ProductoBase):
    pass

class Producto(ProductoBase):
    id: int
    cliente_id: int

    class Config:
        orm_mode = True

class ClienteBase(BaseModel):
    nombre: str
    #email: str

class ClienteCreate(ClienteBase):
    pass

class Cliente(ClienteBase):
    id: int
    productos: List[Producto] = []

    class Config:
        orm_mode = True

