from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

#Usuario
class UsuarioCreate(BaseModel):
    user: str
    password: str

class Usuario(BaseModel):
    id: int
    user: str

    class Config:
        from_attributes = True  # Configuración para Pydantic v2

# Nodo
class NodoCreate(BaseModel):
    id: int
    latitud: float
    longitud: float
    alias: Optional[str] = None
    descripcion: Optional[str] = None
    estado: bool = True

class Nodo(BaseModel):
    id: int
    latitud: float
    longitud: float
    alias: Optional[str] = None
    descripcion: Optional[str] = None
    estado: bool

    class Config:
        orm_mode = True

class NodoResponse(BaseModel):
    id: int
    latitud: float
    longitud: float
    alias: Optional[str] = None
    descripcion: Optional[str] = None
    estado: bool

    class Config:
        orm_mode = True



# Schema para crear un registro de DatosGenerales (entrada)
class DatosGeneralesCreate(BaseModel):
    nodo_id: int
    type: str
    dato: float
    time: datetime

# Schema para mostrar un registro de DatosGenerales (salida)
class DatosGeneralesResponse(BaseModel):
    id: int
    nodo_id: int
    type: str
    dato: float
    time: datetime

    class Config:
        orm_mode = True


# Schema para ver los detalles de un nodo junto con sus datos generales
class NodoDetail(NodoResponse):
    datosGenerales: List[DatosGeneralesResponse] = []

    class Config:
        orm_mode = True
