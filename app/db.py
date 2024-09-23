from sqlalchemy import create_engine, MetaData

create_engine("mysql+pymysql://root:BaseDeDatos@localhost:3306/ ")
meta = MetaData()
conexion = engine.conect()
