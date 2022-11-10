import { useEffect, useState, } from 'react';
import {
    Modal,
    Button,
    Row,
    Col,
    Form,
    FloatingLabel,
} from 'react-bootstrap'
import { CompanyService } from 'services';

function AddVA({ doCreate, ...props}) {
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
    });

    const {
        vaId,
        apiKey,
        name,
        level,
        icao,
        isValid,
        isLoading,
    } = state;

    const _doCreate = async (e) => {
        e.preventDefault();

        doCreate({
            vaId,
            apiKey
        })
    }

    const handleFieldChange = (e) => {
        e.preventDefault();

        setState({
            ...state,
            [e.target.name]: e.target.value,
        })
    }


    useEffect(() => {
        if ((vaId.length === 36 && apiKey.length === 36) && name.length <= 0) {

            setState({
                ...state,
                isLoading: true,
            })

            CompanyService.getOnAirCompanyDetails({
                companyId: vaId,
                apiKey: apiKey,
            })
            .then((res) => {
                console.log('res', res);
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
    }, [vaId, apiKey, name.length, state])

    return (
        <div id="AddVirtualAirline">
        <Button variant="primary" onClick={handleShow}>
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
            <Button variant="primary" onClick={_doCreate} disabled={(isLoading === true || isValid !== true)}>
                Create
            </Button>
            </Modal.Footer>
        </Modal>
        </Form>
        </div>
    );
}

export default AddVA;