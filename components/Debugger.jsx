import { useState, } from 'react';
import { Row, Col, Button, Modal, } from 'react-bootstrap';

function Debugger({ data, ...props }) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const toggle = () => setShow(!show);
    return (<div id='Debugger'>
        <Row>
            <Col>
                <Button
                    onClick={toggle}
                    variant='primary'
                >
                    {`${(show) ? 'Hide' : 'Show'} Debugger`}
                </Button>
            </Col>
        </Row>
        <Modal show={show} fullscreen onHide={handleClose} dialogClassName="modal-90w">
            <Modal.Header closeButton>
                <Modal.Title>Debugger</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <pre>
                    {JSON.stringify(data, null, 2)}
                </pre>
            </Modal.Body>
        </Modal>
    </div>)
}

export default Debugger;