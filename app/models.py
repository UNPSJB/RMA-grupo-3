from sqlalchemy import Table, Column 
from sqlalchemy.sql.sqltypes import Integer, String
from db import meta, engine
clientes = Table("clientes", meta, Column("id", Integer, primary_key=True), 
                                    Column("name", String(255)), 
                                    Column("email", String(255)), 
                                    Column("password", String(255)))
#
'''
productos = Table("productos", meta, Column("id", Integer, primary_key=True), 
                                    Column("name", String(255)), 
                                    Column("precio", Integer(255)))
'''
#
meta.create_all(engine)