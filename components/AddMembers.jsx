import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { Button, Row, Col, Table, Form, Modal, ButtonGroup, } from 'react-bootstrap'
import ClipLoader from "react-spinners/ClipLoader";
import { VirtualAirlineService, AlertService, } from 'services';
import { FaKey } from 'react-icons/fa';

function AddMembers({ onInvite, va, companies, ...props }) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (<>
        <Button
            onClick={handleShow}
            variant='primary'
            disabled={companies.length === 0}
        >
            {(companies.length === 0) ? 'No Companies' : 'Invite Members'}
        </Button>
        <Form>
        <Modal show={show} onHide={handleClose} dialogClassName="modal-90w">
            <Modal.Header closeButton>
                <Modal.Title>Invite Company to VA</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ICAO</th>
                            <th>Name</th>
                            <th>Owner</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <MembersList
                            companies={companies}
                            va={va}
                        />
                    </tbody>
                </Table>
            </Modal.Body>
        </Modal>
        </Form>
    </>)
}

function Member ({ company, va, ...props}) {
    const [Company, setCompany] = useState(company);
    const [isInvited, setIsInvited] = useState(false);
    const [isInviting, setIsInviting] = useState(false);

    const {
        airlineCode,
        name,
        owner,
        level,
        id,
    } = Company;

    const onInvite = async (e) => {
        e.preventDefault();
        setIsInviting(true);
        
        await VirtualAirlineService.inviteMember({
            vaId: va.id,
            companyId: id,
        })
        .then((res) => {
            console.log('onInvite:: res', res);
            setIsInvited(true);
            AlertService.success('Invitation sent');
            setIsInviting(false);
        })
        .catch((err) => {
            console.error(err);
            setIsInvited(false);
            AlertService.error('Error sending invitation');
            setIsInviting(false);
        });
    }

    useEffect(() => {
        setCompany(company);
    }, [company])

    return (
        <tr>
            <td>{airlineCode}</td>
            <td>{name}</td>
            <td>{owner.username}</td>
            <td>
                <Button
                    onClick={(e) => onInvite(e)}
                    variant='primary'
                    disabled={isInvited || isInviting}
                >
                    {(isInviting)
                        ? (<ClipLoader color="#36d7b7" size={12} />)
                        : (isInvited) ? 'Invite Sent' : 'Invite'
                    }
                </Button>
            </td>
        </tr>
    )
}

function MembersList({ companies, va, ...props }) {
    return companies.map((x, i) => (<Member key={i} company={x} va={va} />))
}

export default AddMembers;