import { useState, useEffect } from 'react';
import AppLayout from 'layouts/AppLayout'
import { useRouter } from 'next/router'
import { CompanyRepo, MenuRepo, } from 'repos'
import VirtualAirlineRepo from 'repos/VirtualAirlineRepo'
import { AlertService, AlertType } from 'services';
import { Button, Row, Col, Table, Form, FloatingLabel, ButtonGroup, } from 'react-bootstrap'
import AddVA from 'components/AddVA';
import AddMembers from 'components/AddMembers';
import { VirtualAirlineService } from 'services';
import { FaKey } from 'react-icons/fa';
import DeleteButton from 'components/DeleteButton';
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"
import LevelBar from 'components/LevelBar'
import Debugger from 'components/Debugger'
import ClipLoader from 'react-spinners/ClipLoader';

export async function getServerSideProps(ctx) {
    const { user } = await unstable_getServerSession(ctx.req, ctx.res, authOptions)

    const menus = await MenuRepo.findEnabled({
        serialize: true,
        include: {
            items: true,
        },
    });
    
    const companies = await CompanyRepo.findAll({
        serialize: true,
        include: {
            owner: true,
        }
    })



    const va = await VirtualAirlineRepo.getFirst(null, {
        serialize: true,
        include: {
            owner: true,
            members: {
                include: {
                    owner: true,
                }
            },
        },
        humanize: [
            'createdAt',
            'updatedAt',
            'lastConnection',
            'lastReportDate',
            'creationDate',
            'onAirSyncedAt',
        ]
    })


    return {
        props: {
            menus: {
                mainMenu: menus.filter((x) => x.slug === 'main-menu')[0],
                adminMenu: menus.filter((x) => x.slug === 'admin-menu')[0],
            },
            va,
            companies,
            isOwner: (va && va.owner.id === user.accountId),
            availableMembers: companies.filter((c) => c.virtualAirlineId !== va.id),
        },
    }   
}

function VA({ menus, va, isOwner, companies, availableMembers, ...props }) {
    const router = useRouter();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const doCreate = async (values) => {
        await VirtualAirlineService.create(values)
        .then((x) => {
            router.reload();
            AlertService.success('VA created successfully');
        })
        .catch((e) => {
            AlertService.error('Error creating VA');
        });
    }

    const doInviteMember = (company) => {
        console.log('doInviteMember', company);
    }

    const _doRemoveMember = async (memberId) => {
        console.log('doRemoveMember', memberId);

        await VirtualAirlineService.removeMember({
            vaId: va.id,
            memberId: memberId
        })
        .then((x) => {
            router.reload();
            AlertService.success('Member removed successfully');
        })
        .catch((e) => {
            AlertService.error('Error removing member');
        });
    }

    const onMakeOwner = async (e, cId) => {
        e.preventDefault();

        await VirtualAirlineService.changeOwner({
            vaId: va.id,
            companyId: cId,
        })
        .then((res) => {
            console.log('onInvite:: res', res);
            setIsInvited(true);
            setIsInviting(false);
        })
        .catch((err) => {
            console.error(err);
            setIsInvited(false);
            setIsInviting(false);
        });
    }

    const refreshVA = async (e) => {
        e.preventDefault();
        setIsRefreshing(true);
        await VirtualAirlineService.refresh(va.id)
        .then((res) => {
            console.log('refreshVA:: res', res);
            setIsRefreshing(false);
            AlertService.success('VA refreshed successfully');
            router.reload();
        })
        .catch((err) => {
            console.error(err);
            setIsRefreshing(false);
            AlertService.error('Error refreshing VA');
        });
    }

    return (
        <AppLayout
            menus={menus}
            heading='VA'
        >
            <div>
                {(va) ?
                (<>
                <Row className='mb-3'>
                    <Col md={2}>
                        <FloatingLabel label='ICAO'>
                            <Form.Control
                                type='text'
                                name='airlineCode'
                                defaultValue={va.airlineCode}
                                disabled={true}
                            />
                        </FloatingLabel>
                    </Col>
                    <Col md={7}>
                        <FloatingLabel label='Company Name'>
                            <Form.Control
                                type='text'
                                name='name'
                                defaultValue={va.name}
                                disabled={true}
                            />
                        </FloatingLabel>
                    </Col>
                    <Col md={3}>
                        <FloatingLabel label='Created'>
                            <Form.Control
                                type='text'
                                name='humanized_creationDate'
                                alt={va.creationDate}
                                defaultValue={va.humanized_creationDate}
                                disabled={true}
                            />
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row>
                    <Col md={3}>
                        <FloatingLabel label='Last Connected'>
                            <Form.Control
                                type='text'
                                name='humanized_lastConnection'
                                alt={va.lastConnection}
                                defaultValue={va.humanized_lastConnection}
                                disabled={true}
                            />
                        </FloatingLabel>
                    </Col>
                    <Col md={3}>
                        <FloatingLabel label='Last Sync'>
                            <Form.Control
                                type='text'
                                name='humanized_onAirSyncedAt'
                                alt={va.onAirSyncedAt}
                                defaultValue={va.humanized_onAirSyncedAt}
                                disabled={true}
                            />
                        </FloatingLabel>
                    </Col>
                    <Col md={3}>
                        <FloatingLabel label='Last Report'>
                            <Form.Control
                                type='text'
                                name='humanized_lastReportDate'
                                alt={va.lastReportDate}
                                defaultValue={va.humanized_lastReportDate}
                                disabled={true}
                            />
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row>
                    <Col md={{
                        span: 3,
                        offset:4,
                    }} className='text-center mt-3'>
                        {(va.level) &&
                            <>
                                <h5>{`Level ${va.level}`}</h5>
                                <em style={{
                                    fontSize: '14px'
                                }}>{`${va.levelXP}/${va.level * 1000}`}</em>
                                <LevelBar xp={va.levelXP} level={va.level} levelXP={va.level * 1000} />
                                {va.reputation &&
                                <p style={{
                                    fontSize: '14px'
                                }}>
                                    {`Reputation: ${(va.reputation * 100).toFixed(2)}%`}
                                </p>
                                }
                            </>
                        }
                    </Col>
                </Row>
                
                {(isOwner) &&
                <Row>
                    <Col>
                        <Button variant='primary' onClick={refreshVA} disabled={(va.canSync !== true)}>
                            {(isRefreshing)
                                ? (<span>
                                    <ClipLoader color="#36d7b7" size={12} />
                                    &nbsp;Refreshing...
                                </span>)
                                : (va.canSync === true)
                                    ? 'Request Manual Sync'
                                    : (va.onAirSyncedAt) ? 'You can sync again in 1 min' : 'Request Manual Sync'
                            }
                        </Button>
                    </Col>
                </Row>
                }
                <Row>
                    <Col>
                        <hr />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h2>Members</h2>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Username</th>
                                    <th>Company</th>
                                    <th>Level</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(va.members.length > 0)
                                ? va.members.map((m, i) => (
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{m.owner.username}</td>
                                        <td>{`[${m.airlineCode}] ${m.name}`}</td>
                                        <td>{m.level}</td>
                                        <td>
                                            <ButtonGroup>
                                                <DeleteButton
                                                    variant='danger'
                                                    id={m.id}
                                                    onClick={_doRemoveMember}
                                                    disabled={(!isOwner)}

                                                />
                                                <Button
                                                    onClick={(e) => onMakeOwner(e, m.id)}
                                                    variant='success'
                                                    disabled={(!isOwner)}
                                                >
                                                    <FaKey />
                                                </Button>
                                            </ButtonGroup>
                                        </td>
                                    </tr>
                                ))
                                : (<tr>
                                    <td colSpan={5}>No members</td>
                                </tr>)
                                }
                            </tbody>
                        </Table>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <AddMembers
                            onInvite={doInviteMember}
                            companies={availableMembers}
                            va={va || undefined}
                        />
                    </Col>
                </Row>
                </>)
                : (<>
                    <Row>
                        <Col>
                            <p>No VA found</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <hr />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <AddVA
                                doCreate={doCreate}
                                disabled={(!isOwner)}
                            />
                        </Col>
                    </Row>
                </>)}
            </div>
        </AppLayout>
    );
}

export default VA;