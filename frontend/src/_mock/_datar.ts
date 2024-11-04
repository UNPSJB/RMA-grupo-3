import {
    _id2,
    _fullNodo2,
    _fecha,
    _ubicacion2,
    _temperatura,
    _altura,
    _boolean2,
   
 } from './_mockr';
 
 
 // ---------------------------------------------------------------------- este de abajo es copia de arriba
  
 export const _registros = [...Array(24)].map((_, index) => ({
   id: _id2(index),
   nodo: _fullNodo2(index),
   ubicacion: _ubicacion2(index),
   fecha: _fecha(index),
   temperatura: _temperatura(index),
   altura: _altura(index),
   estado: index % 7 ? 'activo' : 'activo', 
 }));
 
 // ----------------------------------------------------------------------
 
 // ----------------------------------------------------------------------
 
 const COLORS = [
   '#00AB55',
   '#000000',
   '#FFFFFF',
   '#FFC0CB',
   '#FF4842',
   '#1890FF',
   '#94D82D',
   '#FFC107',
 ];
 
 