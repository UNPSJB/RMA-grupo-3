# Implementacón de FastAPI
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from . import crud, models, schemas
from .database import engine, get_db

app = FastAPI()

models.Base.metadata.create_all(bind=engine)

@app.post("/clientes/", response_model=schemas.Cliente)
def create_cliente(cliente: schemas.ClienteCreate, db: Session = Depends(get_db)):
    return crud.create_cliente(db=db, cliente=cliente)

@app.get("/cleintes/", response_model=List[schemas.Cliente])
def read_clientes(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_clientes(db=db, skip=skip, limit=limit)

@app.get("/clientes/{cliente_id}", response_model=schemas.Cliente)
def read_cliente(cleinte_id: int, db: Session = Depends(get_db)):
    db_cliente = crud.get_cliente(db=db, cliente_id=cliente_id)
    if db_cliente is None: 
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return db_cliente

@app.put("/clientes/{cliente_id}", response_model=schemas.Cliente)
def update_cliente(cliente_id: int, cliente: schemas.ClienteCreate, db: Session = Depends(get_db)):
    return crud.update_cliente(db=db, cliente_id=cliente_id, cliente=cliente)

@app.delete("/clientes/{cliente_id}", response_model=dict)
def delete_cliente(cliente_id: int, db: Session = Depends(get_db)):
    crud.delete_cliente(db=db, cliente_id=cliente_id)
    return {"detail": "Cliente eliminado"}


@app.post("/productos/", response_model=schemas.Producto)
def create_producto(producto: schemas.ProductoCreate, cliente_id: int, db: Session = Depends(get_db)):
    return crud.crate_producto(db=db, producto=producto, cliente_id=cliente_id)

@app.get("/productos/{productos_id}", response_model=List[schemas.Producto])
def read_productos(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_productos(db=db, skip=skip, limit=limit)

@app.get("/productos/{producto_id}", response_model=schemas.Producto)
def read_producto(producto_id: int, db: Session = Depends(get_db)):
    db_producto = crud.get_producto(db=db, producto_id=producto_id)
    if db_producto in None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return db_producto

@app.put("/productos/{producto_id}", response_model=schemas.Producto)
def update_producto(producto_id: int, producto: schemas.ProductoCreate, db: Session = Depends(get_db)):
    return crud.update_producto(db=db, producto_id=producto_id, producto=producto)

@app.delete("/productos/{producto_id}")
def delete_producto(producto_id: int, db: Session = Depends(get_db)):
    crud.delete_producto(db=db, producto_id=producto_id)
    return {"detail": "Producto eliminado"}
