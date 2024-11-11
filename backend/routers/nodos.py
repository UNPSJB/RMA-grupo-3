import os
import pandas as pd
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from dependencies import get_db  # Asegúrate de que esto es correcto
from database import Nodo, DatosGenerales  # Importa tu modelo desde el módulo correcto


router = APIRouter()

@router.post("/")
def create_nodo(id: int, latitud: float, longitud: float, alias: str = None, descripcion: str = None, estado: bool = True, db: Session = Depends(get_db)):
    existing_nodo = db.query(Nodo).filter(Nodo.id == id).first()
    if existing_nodo:
        raise HTTPException(status_code=400, detail="El nodo ya existe")

    nodo = Nodo(id=id, latitud=latitud, longitud=longitud, alias=alias, descripcion=descripcion, estado=estado)
    db.add(nodo)
    db.commit()
    db.refresh(nodo)
    
    return nodo

@router.get("/")
def get_nodos(db: Session = Depends(get_db)):
    return db.query(Nodo).all()

@router.get("/export-csv")
def export_csv(db: Session = Depends(get_db)):
    csv_path = './output.csv'
    try:
        if os.path.exists(csv_path):
            os.remove(csv_path)

        # Paso 1: Consulta la tabla usando SQLAlchemy
        rows = db.query(Nodo).all()
        
        # Paso 2: Convierte los resultados en una lista de diccionarios

        # Consulta la tabla Nodo
        nodos = db.query(Nodo).all()
        nodos_data = [
            {column.name: getattr(row, column.name) for column in Nodo.__table__.columns}
            for row in nodos
        ]
        df_nodos = pd.DataFrame(nodos_data)

        # Consulta la tabla DatosGenerales
        datos_generales = db.query(DatosGenerales).all()
        datos_generales_data = [
            {column.name: getattr(row, column.name) for column in DatosGenerales.__table__.columns}
            for row in datos_generales
        ]
        df_datos_generales = pd.DataFrame(datos_generales_data)
        # Consulta la tabla DatosGenerales


        # Escribe ambas tablas en el mismo archivo CSV con secciones separadas
        with open(csv_path, 'w') as f:
            f.write("Tabla: Nodo\n")
            df_nodos.to_csv(f, index=False)
            f.write("\n\nTabla: DatosGenerales\n")
            df_datos_generales.to_csv(f, index=False)



        # Paso 4: Genera el archivo CSV
        #df.to_csv(csv_path, index=False)

        # Paso 5: Envía el archivo para descarga
        #return send_file(csv_path, as_attachment=True, download_name='data.csv')
        #return FileResponse(csv_path, media_type="application/octet-stream", filename=csv_path)
        return FileResponse(csv_path, media_type="text/csv", filename="data.csv")

    except Exception as e:
        raise HTTPException(status_code=404, detail={"error": str(e)})


@router.get("/{nodo_id}")
def get_nodo(nodo_id: int, db: Session = Depends(get_db)):
    nodo = db.query(Nodo).filter(Nodo.id == nodo_id).first()
    if nodo is None:
        raise HTTPException(status_code=404, detail="Nodo no encontrado")
    return nodo

@router.put("/{nodo_id}")
def update_nodo(nodo_id: int, latitud: float = None, longitud: float = None, alias: str = None, descripcion: str = None, estado: bool = None, db: Session = Depends(get_db)):
    nodo = db.query(Nodo).filter(Nodo.id == nodo_id).first()
    if nodo is None:
        raise HTTPException(status_code=404, detail="Nodo no encontrado")

    # Actualizar solo los campos proporcionados
    if latitud is not None:
        nodo.latitud = latitud
    if longitud is not None:
        nodo.longitud = longitud
    if alias is not None:
        nodo.alias = alias
    if descripcion is not None:
        nodo.descripcion = descripcion
    if estado is not None:
        nodo.estado = estado

    db.commit()
    db.refresh(nodo)

    return nodo

@router.delete("/{nodo_id}")
def delete_nodo(nodo_id: int, db: Session = Depends(get_db)):
    nodo = db.query(Nodo).filter(Nodo.id == nodo_id).first()
    if nodo is None:
        raise HTTPException(status_code=404, detail="Nodo no encontrado")
    
    db.delete(nodo)
    db.commit()

    return {"detail": "Nodo eliminado"}


# class YourTable(db.Model):
#     __tablename__ = 'nodos'  # Cambia el nombre a tu tabla

#     # Define las columnas de la tabla (ejemplo)
#     id = Column(Integer, primary_key=True, index=True)
#     latitud = Column(Float)  # Columna para latitud
#     longitud = Column(Float)  # Columna para longitud
#     # Agrega más columnas según tu tabla


