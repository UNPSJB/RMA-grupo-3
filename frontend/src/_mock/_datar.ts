import {
    _id2,
    _fullNodo2,
    _fecha_hora,
    _tipo_dato,
    _dato, 
    _boolean2,
  
   
 } from './_mockr';
 
 
 // ---------------------------------------------------------------------- este de abajo es copia de arriba
  
 export const _registros = [...Array(24)].map((_, index) => ({
   id: _id2(index),
   nodo: _fullNodo2(index),
   fecha_hora: _fecha_hora(index),
   tipoDato: _tipo_dato(index),
   dato: _dato(index),
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
 
 