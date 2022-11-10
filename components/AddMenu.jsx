import {useState, } from 'react';
import { 
    Row,
    Col,
    Form,
    FloatingLabel,
    Modal,
    Button,
} from 'react-bootstrap';

function AddMenu({ doCreate, ...props}) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div id="AddMenu">
        <Button variant="primary" onClick={handleShow}>
            Add Menu
        </Button>

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add New Menu</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Woohoo, you're reading this text in a modal!
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
                Save Changes
            </Button>
            </Modal.Footer>
        </Modal>
        </div>
    );
}

export default AddMenu;