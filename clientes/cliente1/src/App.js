import logo from './images/logo.png';
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import PouchDB from 'pouchdb';
import _filter from 'lodash/filter';
import ClientModal from './components/ClientModal';

function App() {
  const [errorModal, setErrorModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState([]);

  const [clientes, setClientes] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const [contratos, setContratos] = useState([]);

  let databaseUrl = 'http://0.0.0.0:5984';
  const dbClientes = new PouchDB('martin-casas');
  const remoteDB = new PouchDB(databaseUrl + '/martin-casas', { auth: { username: 'admin', password: 'admin'}});

  useEffect(() => {
    setClientes(_filter(data, d => { return d?.doc?.type === 'client' }));
    setPermisos(_filter(data, d => { return d?.doc?.type === 'licence' }));
    setContratos(_filter(data, d => { return d?.doc?.type === 'contract' }));
    console.log('Actualizo los arrays', clientes, permisos, contratos)
  }, [data]);

  useEffect(() => {
    dbClientes.sync(remoteDB, {
      live: true,
      retry: true
    }).on('error', () => {
      handleOpenErrorModal('Error al sincronizar')
      console.log('Error [cliente 1]: fallo al sincronizar')
    });
    fetchData();
  }, []);

  useEffect(() => {
    document.body.style.background = 'black';
  });


  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleSubmit = (tel, name, age) => {
    if (tel !== '' && name !== '' && age !== 0) {
      // submit on pouch
      dbClientes?.post({
        type: 'client',
        name: name,
        tel: tel,
        age: age
      }).then(() => {
        fetchData();
      }).catch((err) => {
        handleOpenErrorModal(`El cliente con nombre ${name} no ha podido ser cargado.`);
        console.log(err);
      });
    }
    handleCloseModal();
  };

  const fetchData = () => {
    dbClientes?.allDocs({
      include_docs: true,
    }).then(result => {
      console.log('Fetch completado', result.rows)
      setData(result.rows);
    }).catch((err) => {
      handleOpenErrorModal('Error al obtener clientes de la base de datos')
      console.log(err);
    });
  };

  const handleOpenErrorModal = (msg) => {
    setErrorModal(true);
    setErrorMsg(msg);
  };

  const renderPermisos = (clientId) => {
    const permisosFiltrados = _filter(permisos, d => { return d.doc.clientId === clientId });
    return permisosFiltrados.map((item,key) => { 
      return (
        <li key={key}>
          {item.doc.nombre} - {item.doc.apellido} - {item.doc.firma}
        </li>
      )
    })
  };

  const renderContratos = (clientId) => {
    const contratosFiltrados = _filter(contratos, d => { return d.doc.clientId === clientId });
    return contratosFiltrados.map((item,key) => { 
      return (
        <li key={key}>
          {item.doc.hash} - {item.doc.firma}
        </li>
      )
    })
  };

  return (
    <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column'}}>
      {errorModal && (
        <Alert variant="danger" onClose={() => { setErrorModal(false); setErrorMsg(''); }} dismissible>
          <Alert.Heading>Error!</Alert.Heading>
          <p>
            {errorMsg}
          </p>
        </Alert>
      )}

      <ClientModal
        isVisible={modalVisible}
        handleClose={handleCloseModal}
        handleSubmit={handleSubmit}
      />

      <div style={{ alignSelf: 'center', justifyContent: 'center', marginTop: '100px', marginBottom: '100px'}}>
        <img src={logo} className="App-logo" alt="logo" style={{width: '500px', height: '350px'}} />
        <Row>
          <Col>
            <div style={{color: 'yellow', marginTop: '50px'}}>
              <b> CLIENTES </b> 
            </div>
          </Col>
          <Col>
            <Button onClick={fetchData} variant="link"> Refrescar lista</Button>
          </Col>
        </Row>
        {clientes?.map((client, index) =>
          <div key={client?.doc?._id} style={{marginTop: '20px', marginBottom: '20px'}}> 
            <div style={{color: 'yellow'}}> <b> Cliente {index + 1} </b> </div>
            <div style={{marginLeft: '20px', color: 'white'}}>
              <Row>
                Informacion del cliente: {client?.doc?.name} - {client?.doc?.age} - {client?.doc?.tel}
              </Row>
              <Row>
                Permisos: 
                <Col>
                  <ul>
                    {renderPermisos(client?.doc?._id)}
                  </ul>
                </Col>
              </Row>
              <Row>
                Contratos:
                <Col>
                  <ul>
                    {renderContratos(client?.doc?._id)}
                  </ul>
                </Col>
              </Row>
          </div>
          </div>
        )}
        <Button onClick={handleOpenModal}> NUEVO CLIENTE </Button>
      </div>
    </div>
  );
}

export default App;
