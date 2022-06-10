const config = require('../config.json');
const loteDatos = require('../lote_datos.json');
import _sample from 'lodash/sample';

const db = null;

async function main() {  
  if (db) { //ya me conecte a la bd
    while (true) {
      let timeInMs = Math.random() * (4000);
      console.log('random time to post => ', timeInMs);
      let postPermiso = async function () {
        //Genero permiso
        const permiso = generarPermiso();
        //Posteo permiso
        await db.post(permiso); // TODO
        console.log("Permisos insertados.")
      };
      setTimeout(postPermiso, timeInMs);
    }
  };
}

async function generarPermiso() {
  const nombre = _sample(loteDatos.nombres);
  const apellido = _sample(loteDatos.apellidos);
  const firma = _sample(loteDatos.hashes);
  const texto = _sample(loteDatos.textos);
  return {
    nombre,
    apellido,
    firma,
    texto
  }
}

main();