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

  let databaseUrl = 'http://0.0.0.0:5984';
  const dbClientes = new PouchDB('martin-casas');
  const remoteDB = new PouchDB(databaseUrl + '/martin-casas', { auth: { username: 'admin', password: 'hernaneta777'}});

  const clientes = _filter(data, d => { return d.type === 'client' });
  const permisos = _filter(data, d => { return d.type === 'licence' });
  const contratos = _filter(data, d => { return d.type === 'contract' });

  useEffect(() => {
    dbClientes.sync(remoteDB, {
      live: true,
      retry: true
    }).on('error', () => {
      handleOpenErrorModal('Error al sincronizar')
      console.log('Error [cliente 1]: fallo al sincronizar')
    });
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
    const permisosFiltrados = _filter(permisos, d => { return d.clientId === clientId });
    return permisosFiltrados.map((item,key) => { 
      return (
        <li key={key}>
          {item.nombre} - {item.apellido} - {item.firma}
        </li>
      )
    })
  };

  const renderContratos = (clientId) => {
    const contratosFiltrados = _filter(contratos, d => { return d.clientId === clientId });
    return contratosFiltrados.map((item,key) => { 
      return (
        <li key={key}>
          {item.hash} - {item.firma}
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
          <div key={client._id} style={{marginTop: '20px', marginBottom: '20px'}}> 
            <div style={{color: 'yellow'}}> <b> Cliente {index + 1} </b> </div>
            <div style={{marginLeft: '20px', color: 'white'}}>
              <Row>
                Informacion del cliente: {client?.doc?.name} - {client?.doc?.age} - {client?.doc?.tel}
              </Row>
              <Row>
                Permisos: 
                <Col>
                  <ul>
                    {renderPermisos(client?._id)}
                  </ul>
                </Col>
              </Row>
              <Row>
                Contratos:
                <Col>
                  <ul>
                    {renderContratos(client?._id)}
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
