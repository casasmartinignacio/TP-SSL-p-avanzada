import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

function ClientModal({ isVisible, handleClose, handleSubmit }) {
  const [name, setName] = useState('');
  const [tel, setTel] = useState('223000000');
  const [age, setAge] = useState(0);

  const setEmptyValues = () => {
    setName('');
    setTel('223000000');
    setAge(0);
  };

  const renderNumbers = () => {
    const numbers = [];
    [0,1,2,3,4,5,6,7,8,9].forEach(function(i) {
      numbers.push(<option key={i} value={i}> {i} </option>);
    });
    return numbers;
  };

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

  return (
    <Modal
      show={isVisible}
      onHide={handleClose}
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
          <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
          <Button variant="primary" onClick={(e) => {handleSubmit(tel, name, age); setEmptyValues();}}>
            Enviar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default ClientModal;
