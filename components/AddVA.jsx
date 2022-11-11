import { useEffect, useState, } from 'react';
import {
    Modal,
    Button,
    Row,
    Col,
    Form,
    FloatingLabel,
} from 'react-bootstrap'
import { AlertService } from 'services';
import { VirtualAirlineService } from 'services';
import ClipLoader from "react-spinners/ClipLoader";

function AddVA({ doCreate, disabled, ...props}) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [state, setState] = useState({
        vaId: '',
        apiKey: '',
        name: '',
        level: '',
        icao: '',
        isValid: false,
        isLoading: false,
        isSubmitting: false,
    });

    const {
        vaId,
        apiKey,
        name,
        level,
        icao,
        isValid,
        isLoading,
        isSubmitting,
    } = state;

    const _doCreate = async (e) => {
        e.preventDefault();
        setState({ ...state, isSubmitting: true });

        await doCreate({
            vaId,
            apiKey
        })
        .then((res) => {
            setState({ ...state, isSubmitting: false });

            handleClose();
            if (res) {
                AlertService.success('Virtual Airline added successfully.');
            }
        })
        .catch((err) => {
            setState({ ...state, isSubmitting: false });
            AlertService.error('Error adding Virtual Airline, consult with the administrator in Discord.');
        })
    }

    const handleFieldChange = (e) => {
        e.preventDefault();

        setState({
            ...state,
            [e.target.name]: e.target.value,
        })
    }

    const queryOnAir = async (e) => {
        e.preventDefault();
        setState({
            ...state,
            isLoading: true,
        })

        await VirtualAirlineService.getOnAirVADetails({
            vaId: vaId,
            apiKey: apiKey,
        })
        .then((res) => {
            setState({
                ...state,
                isValid: true,
                name: res.Name,
                level: res.Level,
                icao: res.AirlineCode,
                isLoading: false,
            })
        })
        .catch((err) => {
            console.log('err', err);
            setState({
                ...state,
                isValid: false,
                isLoading: false,
            })
        })
        
    }

    return (
        <div id="AddVirtualAirline">
        <Button variant="primary" onClick={handleShow} disabled={disabled}>
            Add Virtual Airline
        </Button>

        <Form>
        <Modal show={show} onHide={handleClose} dialogClassName="modal-90w">
            <Modal.Header closeButton>
                <Modal.Title>Add New Virtual Airline</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col md={6}>
                    <Form.Group>
                        <FloatingLabel label='VA ID'>
                            <Form.Control
                                type='text'
                                name='vaId'
                                id='vaId'
                                className='mb-3'
                                onChange={handleFieldChange}
                                value={vaId}
                            />  
                        </FloatingLabel>
                    </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <FloatingLabel label='VA API Key'>
                                <Form.Control
                                type='text'
                                name='apiKey'
                                id='apiKey'
                                className='mb-3'
                                onChange={handleFieldChange}
                                value={apiKey}
                                />
                            </FloatingLabel>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className='mb-3'>
                    <Col>
                        <div className="d-grid gap-2">
                            <Button variant="primary" onClick={queryOnAir}>
                                {(isLoading)
                                    ? (<span>
                                        <ClipLoader color="#36d7b7" size={12} />
                                        &nbsp;Loading...
                                    </span>)
                                    : 'Query OnAir'
                                }
                            </Button>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md={4}>
                        <Form.Group>
                        <FloatingLabel label='ICAO'>
                            <Form.Control
                            type='text'
                            name='icao'
                            id='icao'
                            className='mb-3'
                            defaultValue={icao}
                            onChange={handleFieldChange}
                            disabled
                            />
                        </FloatingLabel>
                        </Form.Group>
                    </Col>
                    <Col md={8}>
                        <Form.Group>
                        <FloatingLabel label='VA Name'>
                            <Form.Control
                            type='text'
                            name='name'
                            id='name'
                            className='mb-3'
                            defaultValue={name}
                            onChange={handleFieldChange}
                            disabled
                            />
                        </FloatingLabel>
                        </Form.Group>
                    </Col>
                    </Row>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            <Button variant="primary" onClick={_doCreate} disabled={disabled || (isSubmitting === true || isLoading === true || isValid === false)}>
            {(isSubmitting)
                ? (<span>
                    <ClipLoader color="#36d7b7" size={12} />
                    &nbsp;Saving...
                </span>)
                : 'Create'
            }
            </Button>
            </Modal.Footer>
        </Modal>
        </Form>
        </div>
    );
}

export default AddVA;