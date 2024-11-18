import os
import pandas as pd
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from sqlalchemy import desc
from dependencies import get_db  # Asegúrate de que esto es correcto
from database import Nodo, DatosGenerales  # Importa tu modelo desde el módulo correcto
import schemas

router = APIRouter()

@router.post("/", response_model=schemas.Nodo)
def create_nodo(nodo_data: schemas.NodoCreate, db: Session = Depends(get_db)):
    existing_nodo = db.query(Nodo).filter(Nodo.id == nodo_data.id).first()
    if existing_nodo:
        raise HTTPException(status_code=400, detail="El nodo ya existe")

    nodo = Nodo(**nodo_data.dict())
    db.add(nodo)
    db.commit()
    db.refresh(nodo)
    return nodo

@router.get("/", response_model=list[schemas.Nodo])
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

            # Actualizar solo los campos proporcionados
        for row in datos_generales_data:
            if row.get("type"):  # Cambia "tu_variable" por el nombre de la columna
                if row["type"] == "temp_t":
                    row["type"] = "Temperatura °C"
                elif row["type"] == "altitude_t":
                    row["type"] = "Altitud mm"
                elif row["type"] == "voltage_t":
                    row["type"] = "Voltage V"
                elif row["type"] == "rainfall_t":
                    row["type"] = "Precipitación mm"
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

@router.get("/get-data")
def get_data(db: Session = Depends(get_db)):
    try:
        data = []

        # Consulta todos los nodos
        nodos = db.query(Nodo).all()

        for nodo in nodos:
            # Obtén el último dato de voltage_t para el nodo actual
            ultimo_voltaje = (
                db.query(DatosGenerales)
                .filter(DatosGenerales.nodo_id == nodo.id, DatosGenerales.type == "voltage_t")
                .order_by(desc(DatosGenerales.time))
                .first()
            )

            # Agrega la información al resultado
            data.append({
                "id": nodo.id,
                "latitud": nodo.latitud,
                "longitud": nodo.longitud,
                "alias": nodo.alias,
                "estado": nodo.estado,
                "ultimo_voltaje": ultimo_voltaje.dato if ultimo_voltaje else None
            })

        return {"data": data}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener datos: {str(e)}")


@router.get("/{nodo_id}")
def get_nodo(nodo_id: int, db: Session = Depends(get_db)):
    nodo = db.query(Nodo).filter(Nodo.id == nodo_id).first()
    if nodo is None:
        raise HTTPException(status_code=404, detail="Nodo no encontrado")
    return nodo

@router.put("/{nodo_id}", response_model=schemas.Nodo)
def update_nodo(nodo_id: int, nodo_data: schemas.NodoCreate, db: Session = Depends(get_db)):
    nodo = db.query(Nodo).filter(Nodo.id == nodo_id).first()
    if nodo is None:
        raise HTTPException(status_code=404, detail="Nodo no encontrado")



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


@router.put("/{nodo_id}/deactivate")
def deactivate_nodo(nodo_id: int, db: Session = Depends(get_db)):
    nodo = db.query(Nodo).filter(Nodo.id == nodo_id).first()
    if nodo is None:
        raise HTTPException(status_code=404, detail="Nodo no encontrado")
    
    nodo.estado = False
    db.commit()
    return {"detail": "Nodo desactivado"}

