import loteDatos from './lote_datos.js';
import _sample from 'lodash/sample.js';
import _filter from 'lodash/filter.js';
import PouchDB from 'pouchdb';

async function main() {
  let databaseUrl = 'http://0.0.0.0:5984';
  const dbClientes = new PouchDB('martin-casas');
  const remoteDB = new PouchDB(databaseUrl + '/martin-casas', { auth: { username: 'admin', password: 'hernaneta777'}});

  dbClientes.sync(remoteDB, {
    live: true,
    retry: true
  }).on('error', () => {
    console.log('Error [cliente 2]: fallo al sincronizar')
  });

  if (dbClientes) { //ya me conecte a la bd
    let postPermiso = async function () {
      // Fetch clientes
      dbClientes?.allDocs({
        include_docs: true,
      }).then(result => {
        //Tomo cliente al azar
        const randomClientId = elegirCliente(result.rows);
        console.log("Evento [cliente 2]: Cliente elegido ", randomClientId)
        if (randomClientId) {
          //Genero permiso para una persona random emitido por el cliente elegido
          const permiso = generarPermiso(randomClientId);
          //Posteo permiso
          dbClientes.post(
            permiso
          ).then(() => {
            console.log("Evento [cliente 2]: Permiso insertado. ", JSON.stringify(permiso))
          }).catch(() => {
            console.log('Error [cliente 2]: fallo al postear permiso', JSON.stringify(permiso))
          });
        } else {
          console.log("Evento [cliente 2]: No hay ningun cliente para generar permisos!")
        }
      })

    };
    setInterval(postPermiso, 4000);
  };
}

function generarPermiso(clientId) {
  const nombre = _sample(loteDatos.nombres);
  const apellido = _sample(loteDatos.apellidos);
  const firma = _sample(loteDatos.hashes);
  const texto = _sample(loteDatos.textos);
  return {
    clientId,
    nombre,
    type: "licence",
    apellido,
    firma,
    texto
  }
}

function elegirCliente(allDocs) {
  const clientes = _filter(allDocs, d => { return d.type === 'client' });
  const client = _sample(clientes);
  return client ? client._id : null;
}

main();