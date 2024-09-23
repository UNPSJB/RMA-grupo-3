from typing import Optional
from pydantic import BaseModel

class Cliente(BaseModel):
    id: Optional[str]
    name: str
    email: str
    password: str

class Producto(BaseModel):
    id: Optional[str]
    name: str
    precio: str