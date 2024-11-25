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

        # Consulta de nodos y datos generales
        nodos = db.query(Nodo).all()
        datos_generales = db.query(DatosGenerales).all()

        # Crear estructura combinada
        export_data = []

        # Crear un diccionario para mapear `nodo_id` a su alias
        nodo_alias_map = {nodo.id: nodo.alias for nodo in nodos}

        for nodo in nodos:
            # Filtrar datos generales correspondientes al nodo
            datos_nodo = [dato for dato in datos_generales if dato.nodo_id == nodo.id]
            
            for dato in datos_nodo:
                row = {
                    "Numero de nodo": nodo.id,
                    "Alias": nodo.alias,
                    "Temperatura [°C]": dato.dato if dato.type == "temp_t" else None,
                    "Altitud [cm]": dato.dato if dato.type == "altitude_t" else None,
                    "Precipitacion [mm]": dato.dato if dato.type == "rainfall_t" else None,
                    "Voltaje [V]": dato.dato if dato.type == "voltage_t" else None,
                    "Tiempo": dato.time
                }
                export_data.append(row)

        # Crear DataFrame con pandas
        df = pd.DataFrame(export_data)

        # Reemplazar NaN por vacío para un CSV más limpio
        df.fillna('', inplace=True)

        # Exportar a CSV
        df.to_csv(csv_path, index=False)

        # Retornar archivo CSV generado
        return FileResponse(csv_path, media_type="text/csv", filename="data.csv")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al exportar CSV: {str(e)}")


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


@router.get("/tabla-datos")
def get_tabla_datos(nodo_id: int = None, db: Session = Depends(get_db)):
    try:
        # Lista de columnas que devolveremos
        tabla_datos = []

        if nodo_id:
            nodos = db.query(Nodo).filter(Nodo.id == nodo_id).all()
        else:
            nodos = db.query(Nodo).all()

        for nodo in nodos:
            datos_generales = (
                db.query(DatosGenerales)
                .filter(DatosGenerales.nodo_id == nodo.id)
                .all()
            )

            for dato in datos_generales:
                fila = {
                    "Numero de nodo": nodo.id,
                    "Alias": nodo.alias,
                    "Temperatura [°C]": dato.dato if dato.type == "temp_t" else None,
                    "Voltaje [V]": dato.dato if dato.type == "voltage_t" else None,
                    "Precipitacion [mm]": dato.dato if dato.type == "rainfall_t" else None,
                    "Altitud [cm]": dato.dato if dato.type == "altitude_t" else None,
                    "Tiempo": dato.time,
                }
                tabla_datos.append(fila)

        return {"tabla_datos": tabla_datos}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al generar la tabla de datos: {str(e)}")


@router.get("/{nodo_id}")
def get_nodo(nodo_id: int, db: Session = Depends(get_db)):
    nodo = db.query(Nodo).filter(Nodo.id == nodo_id).first()
    if nodo is None:
        raise HTTPException(status_code=404, detail="Nodo no encontrado")
    return nodo






@router.put("/{nodo_id}", response_model=schemas.Nodo)
def update_nodo(nodo_id: int, nodo_data: schemas.NodoUpdate, db: Session = Depends(get_db)):
    # Buscar el nodo por ID
    nodo = db.query(Nodo).filter(Nodo.id == nodo_id).first()
    if nodo is None:
        raise HTTPException(status_code=404, detail="Nodo no encontrado")
    
    # Actualizar los campos que vienen en la solicitud
    nodo.latitud = nodo_data.latitud
    nodo.longitud = nodo_data.longitud
    nodo.alias = nodo_data.alias
    nodo.descripcion = nodo_data.descripcion

    # Guardar los cambios
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

