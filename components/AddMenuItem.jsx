import {useState, } from 'react';
import { 
    Row,
    Col,
    Form,
    FloatingLabel,
    Modal,
    Button,
} from 'react-bootstrap';

function AddMenuItem({ doCreate, menu, ...props}) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [menuItem, setMenuItem] = useState({
        menuId: menu.id,
        name: '',
        label: '',
        href: '',
        isDisabled: false,
        isExternal: false,
        isAuthRequired: false,
        adminOnly: false,
    });

    const handleFieldChange = (e) => {
        setMenuItem({
            ...menuItem,
            [e.target.name]: (e.target.type === 'checkbox') ? e.target.checked : e.target.value,
        });
    }

    const _doCreate = (e) => {
        e.preventDefault();
        console.log(menuItem);
        doCreate(menuItem);
        handleClose();
    }

    return (
        <div id="AddMenuItem">
        <Button variant="primary" onClick={handleShow}>
            Add Menu Item
        </Button>

        <Form>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add New Menu Item</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col md={6}>
                        <FloatingLabel
                            label="Name"
                            className="mb-3"
                        >
                            <Form.Control
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Name"
                                required
                                onChange={handleFieldChange}
                            />
                        </FloatingLabel>
                    </Col>
                    <Col md={6}>
                        <FloatingLabel
                            label="Label"
                            className="mb-3"
                        >
                            <Form.Control
                                type="text"
                                name="label"
                                id="label"
                                placeholder="Label"
                                onChange={handleFieldChange}
                            />
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <FloatingLabel
                            label="href"
                            className="mb-3"
                        >
                            <Form.Control
                                type="text"
                                name="href"
                                id="href"
                                placeholder="href"
                                onChange={handleFieldChange}
                            />
                        </FloatingLabel>
                    </Col>
                    <Col md={6}>
                        <Form.Switch
                            id="isDisabled"
                            label="Disabled"
                            name="isDisabled"
                            defaultChecked={false}
                            onChange={handleFieldChange}
                        />
                        <Form.Switch
                            id="isExternal"
                            label="External"
                            name="isExternal"
                            defaultChecked={false}
                            onChange={handleFieldChange}
                        />
                        <Form.Switch
                            id="isAuthRequired"
                            label="Auth Required"
                            name="isAuthRequired"
                            defaultChecked={false}
                            onChange={handleFieldChange}
                        />
                        <Form.Switch
                            id="adminOnly"
                            label="Admin Only"
                            name="adminOnly"
                            defaultChecked={false}
                            onChange={handleFieldChange}
                        />
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            <Button variant="primary" onClick={_doCreate}>
                Save Changes
            </Button>
            </Modal.Footer>
        </Modal>
        </Form>
        </div>
    );
}

export default AddMenuItem;