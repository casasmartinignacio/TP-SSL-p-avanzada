import loteDatos from './lote_datos.js';
import _sample from 'lodash/sample.js';
import _filter from 'lodash/filter.js';
import PouchDB from 'pouchdb';

async function main() {
  let databaseUrl = 'http://0.0.0.0:5984';
  const dbClientes = new PouchDB('martin-casas');
  const remoteDB = new PouchDB(databaseUrl + '/martin-casas', { auth: { username: 'admin', password: 'admin'}});

  dbClientes.sync(remoteDB, {
    live: true,
    retry: true
  }).on('error', () => {
    console.log('Error [cliente 3]: fallo al sincronizar')
  });

  if (dbClientes) { //ya me conecte a la bd
    let postContrato = async function () {
      // Fetch clientes
      dbClientes.allDocs({
        include_docs: true,
      }).then(result => {
        //console.log("Evento [cliente 3]: All docs ", result.rows)
        //Tomo cliente al azar
        const randomClientId = elegirCliente(result.rows);
        console.log("Evento [cliente 3]: Cliente elegido ", randomClientId)
        if (randomClientId) {
          //Genero contrato para una persona random emitido por el cliente elegido
          const contrato = generarContrato(randomClientId);
          //Posteo contrato
          dbClientes.post(
            contrato
          ).then(() => {
            console.log("Evento [cliente 3]: contrato insertado. ", JSON.stringify(contrato))
          }).catch(() => {
            console.log('Error [cliente 3]: fallo al postear contrato', JSON.stringify(contrato))
          });
        } else {
          console.log("Evento [cliente 3]: No hay ningun cliente para generar contrato!")
        }
      })

    };
    setInterval(postContrato, 4000);
  };
}

function generarContrato(clientId) {
  const hash = _sample(loteDatos.hashes);
  const firma = _sample(loteDatos.hashes);
  return {
    clientId,
    hash,
    type: "contract",
    firma
  }
}

function elegirCliente(allDocs) {
  const clientes = _filter(allDocs, d => { return d.doc.type === 'client' });
  const client = _sample(clientes);
  return client ? client.doc._id : null;
}

main();