from flask import Flask, send_file, jsonify
from flask_sqlalchemy import SQLAlchemy
import pandas as pd
import os

# Inicializa la aplicación Flask
app = Flask(__name__)

# Configura la base de datos SQLite con SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///./test.db'  # Cambia esta ruta
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializa SQLAlchemy
db = SQLAlchemy(app)

# Define el modelo de la tabla
class YourTable(db.Model):
    __tablename__ = 'nodos'  # Cambia el nombre a tu tabla

    # Define las columnas de la tabla (ejemplo)
    id = Column(Integer, primary_key=True, index=True)
    latitud = Column(Float)  # Columna para latitud
    longitud = Column(Float)  # Columna para longitud
    # Agrega más columnas según tu tabla

# Ruta para exportar la tabla a CSV
@app.route('/export-csv', methods=['GET'])
def export_csv():
    try:
        # Paso 1: Consulta la tabla usando SQLAlchemy
        rows = YourTable.query.all()
        
        # Paso 2: Convierte los resultados en una lista de diccionarios
        data = [
            {column.name: getattr(row, column.name) for column in YourTable.__table__.columns}
            for row in rows
        ]

        # Paso 3: Convierte la lista de diccionarios en un DataFrame de pandas
        df = pd.DataFrame(data)

        # Paso 4: Genera el archivo CSV
        csv_path = 'output.csv'
        df.to_csv(csv_path, index=False)

        # Paso 5: Envía el archivo para descarga
        return send_file(csv_path, as_attachment=True, download_name='data.csv')

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        # Limpia el archivo temporal
        if os.path.exists(csv_path):
            os.remove(csv_path)

if __name__ == '__main__':
    # Crear la base de datos y las tablas si no existen (solo la primera vez)
    db.create_all()
    app.run(debug=True)
