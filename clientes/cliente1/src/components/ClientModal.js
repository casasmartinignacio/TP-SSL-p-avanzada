function App() {
  const [errorModal, setErrorModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [name, setName] = useState('');
  const [tel, setTel] = useState('223000000');
  const [age, setAge] = useState(0);

  let databaseUrl = 'http://0.0.0.0:5984';
  const dbClientes = new PouchDB('martin-casas');
  const remoteDB = new PouchDB(databaseUrl + '/martin-casas', { auth: { username: 'admin', password: 'hernaneta777'}});

  const clientes = _filter(data, d => { return d.type === 'client' });
  const permisos = _filter(data, d => { return d.type === 'licence' });
  const contratos = _filter(data, d => { return d.type === 'contract' });

  useEffect(() => {
    document.body.style.background = 'black';
  });

  const handleTelChange = (e, pos) => {
    let newTel = tel;
    newTel = tel.substring(0, pos) + e?.target?.value + tel.substring(pos + e?.target?.value.length);
    setTel(newTel);
  };

  const handleNameChange = (e) => {
    setName(e?.target?.value);
  };

  const handleAgeChange = (e) => {
    setAge(e?.target?.value);
  };

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const renderNumbers = () => {
    const numbers = [];
    [0,1,2,3,4,5,6,7,8,9].forEach(function(i) {
      numbers.push(<option key={i} value={i}> {i} </option>);
    });
    return numbers;
  };

  const handleSubmit = () => {
    console.log(tel, name, age, dbClientes)
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
    setEmptyValues();
    handleCloseModal();
  };

  const setEmptyValues = () => {
    setName('');
    setTel('223000000');
    setAge(0);
  };

  const fetchData = () => {
    dbClientes?.allDocs({
      include_docs: true,
      attachments: true
    }).then(result => {
      setData(result.rows);
    }).catch((err) => {
      handleOpenErrorModal('Error al obtener clientes de la base de datos')
      console.log(err);
    });
  };

  useEffect(() => {
    dbClientes.sync(remoteDB, {
      live: true,
      retry: true
    }).on('error', () => {
      handleOpenErrorModal('Error al conectar a base de datos remota (Docker)')
    });
  }, []);

  const handleOpenErrorModal = (msg) => {
    setErrorModal(true);
    setErrorMsg(msg);
  };

  return (
    <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column'}}>
      {errorModal && (
        <Alert variant="danger" onClose={() => { setErrorModal(false); setErrorMsg(''); setEmptyValues(); }} dismissible>
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

      <Modal
        show={modalVisible}
        onHide={handleCloseModal}
        backdrop="static"
        keyboard={false}
        size="xl"
      >
        <Form>
          <Modal.Header closeButton>
            <Modal.Title>Nuevo cliente</Modal.Title>
          </Modal.Header>
        
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del cliente</Form.Label>
              <Form.Control placeholder="Nombre" value={name} onChange={handleNameChange} />
            </Form.Group>
    
            <Form.Group className="mb-3">
              <Form.Label>Telefono</Form.Label>
              <Row>
                ( 223 ) -
                <Col>
                  <Form.Select size="sm" style={{width: '100px'}} value={tel[3]} onChange={e => handleTelChange(e, 3)}>
                    {renderNumbers()}
                  </Form.Select> 
                </Col>
                <Col>
                  <Form.Select size="sm" style={{width: '100px'}} value={tel[4]} onChange={e => handleTelChange(e, 4)}>
                    {renderNumbers()}
                  </Form.Select> 
                </Col>
                <Col>
                  <Form.Select size="sm" style={{width: '100px'}} value={tel[5]} onChange={e => handleTelChange(e, 5)}>
                    {renderNumbers()}
                  </Form.Select> 
                </Col>
                <Col>
                  <Form.Select size="sm" style={{width: '100px'}} value={tel[6]} onChange={e => handleTelChange(e, 6)}>
                    {renderNumbers()}
                  </Form.Select> 
                </Col>
                <Col>
                  <Form.Select size="sm" style={{width: '100px'}} value={tel[7]} onChange={e => handleTelChange(e, 7)}>
                    {renderNumbers()}
                  </Form.Select> 
                </Col>
                <Col>
                  <Form.Select size="sm" style={{width: '100px'}} value={tel[8]} onChange={e => handleTelChange(e, 8)}>
                    {renderNumbers()}
                  </Form.Select> 
                </Col>
              </Row>
              <Form.Text> {tel} </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Edad</Form.Label>
              <Form.Range value={age} onChange={handleAgeChange} />
              <Form.Text> {age} </Form.Text>
            </Form.Group>
          </Modal.Body>
        
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>Cerrar</Button>
            <Button variant="primary" onClick={handleSubmit}>
              Enviar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <div style={{ alignSelf: 'center', justifyContent: 'center', marginTop: '100px', marginBottom: '100px'}}>
        <img src={logo} className="App-logo" alt="logo" style={{width: '300px', height: '350px'}} />
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
        {data?.map((client, index) =>
          <div key={client._id} style={{marginTop: '20px', marginBottom: '20px'}}> 
            <div style={{color: 'yellow'}}> <b> Cliente {index + 1} </b> </div>
            <div style={{marginLeft: '20px', color: 'white'}}>
              <Row>
                Informacion del cliente: {client?.doc?.name} - {client?.doc?.age} - {client?.doc?.tel}
              </Row>
              <Row>
                Contratos: 
              </Row>
              <Row>
                Permisos:
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
