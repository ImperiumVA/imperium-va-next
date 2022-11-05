import { useState, useEffect, useReducer, } from 'react';
import AppLayout from 'layouts/AppLayout'
import { useSession, } from "next-auth/react"
import { unstable_getServerSession } from "next-auth/next"
import { MenuRepo } from 'repos'
import { CompanyService } from 'services';
import OnAirForm from 'components/OnAirForm'
import LevelBar from 'components/LevelBar'
import { Row, Col, Form, FloatingLabel, Button, } from 'react-bootstrap'
import { OnAirCompanyRepo } from 'repos';
import { authOptions } from "pages/api/auth/[...nextauth]"
import { useRouter, } from 'next/router';
import Reducer from 'reducers';

export async function getServerSideProps(ctx) {
    const { 
        req, 
        res
    } = ctx
    
    const session = await unstable_getServerSession(
        req,
        res,
        authOptions
    )
    
    const menus = await MenuRepo.findEnabled({
        serialize: true,
        include: {
            items: true,
        },
    });
    

    const company = await OnAirCompanyRepo.findByOwnerId(session.user.accountId, {
        humanize: ['createdAt', 'updatedAt', 'onAirSyncedAt', 'lastConnection', 'lastReportDate', 'creationDate', 'pausedDate', 'lastWeeklyManagementsPaymentDate'],
        serialize: true
    })

    return {
        props: {
            user: JSON.parse(JSON.stringify(session.user)),
            menus: {
                mainMenu: menus.filter((x) => x.slug === 'main-menu')[0],
                adminMenu: menus.filter((x) => x.slug === 'admin-menu')[0],
            },
            onAir: {
                company,
            }
        },
    }
}

function me({
    menus,
    onAir,
    user,
}) {
    const [state, dispatch] = useReducer(Reducer, onAir);

    const router = useRouter()
    const profileImage = user.image || '/ProfilePhoto.jpg'

    const upsertOnAir = async (values) => {
        if (!user) return;

        const x = await CompanyService.upsert(user.accountId, values)
        return x
    }

    const syncOnAir = async () => {
        console.log('syncOnAir')

        if (!user) return;

        const x = await CompanyService.upsert(user.accountId, {
            apiKey: state.company.companyApiKey,
            companyId: state.company.companyId
        })

        return x
    }

    return (
        <AppLayout
            menus={menus}
            heading={`Hi, ${user.name}`}
        >
            {(state)
            ? (<>
                <Row>
                    <Col>
                        <h2>OnAir Details</h2>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p>
                            Thanks for adding your OnAir Company to the platform. Your Discord account has been linked to your OnAir Company. Stay tuned to the Discord channel for new features and updates.
                        </p>
                    </Col>
                </Row>
                <Row className='mb-3'>
                    <Col md={2}>
                        <FloatingLabel label='ICAO'>
                            <Form.Control
                                type='text'
                                name='airlineCode'
                                defaultValue={state.company.airlineCode}
                                disabled={true}
                            />
                        </FloatingLabel>
                    </Col>
                    <Col md={7}>
                        <FloatingLabel label='Company Name'>
                            <Form.Control
                                type='text'
                                name='name'
                                defaultValue={state.company.name}
                                disabled={true}
                            />
                        </FloatingLabel>
                    </Col>
                    <Col md={3}>
                        <FloatingLabel label='Last Sync'>
                            <Form.Control
                                type='text'
                                name='humanized_onAirSyncedAt'
                                defaultValue={state.company.humanized_onAirSyncedAt}
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
                                defaultValue={state.company.humanized_lastConnection}
                                disabled={true}
                            />
                        </FloatingLabel>
                    </Col>
                    <Col md={3}>
                        <FloatingLabel label='Last Pay Date'>
                            <Form.Control
                                type='text'
                                name='humanized_lastWeeklyManagementsPaymentDate'
                                defaultValue={state.company.humanized_lastWeeklyManagementsPaymentDate}
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
                        {(state.company.level) &&
                            <>
                                <h5>{`Level ${state.company.level}`}</h5>
                                <em style={{
                                    fontSize: '14px'
                                }}>{`${state.company.levelXP}/${state.company.level * 1000}`}</em>
                                <LevelBar xp={state.company.levelXP} level={state.company.level} levelXP={state.company.level * 1000} />
                                {state.company.reputation &&
                                <p style={{
                                    fontSize: '14px'
                                }}>
                                    {`Reputation: ${(state.company.reputation * 100).toFixed(2)}%`}
                                </p>
                                }
                            </>
                        }
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button variant='primary' onClick={syncOnAir}>Sync</Button>
                    </Col>
                </Row>
            </>)
            : (<>
            
                <Row>
                    <Col>
                        <p>It looks like you haven't connected your On Air account yet.<br/>
                        Go ahead and add Your OnAir Company details below to associate your Discord account to your OnAir Company.
                        </p>
                    </Col>
                </Row>
                
                <Row>
                    <Col>
                        <OnAirForm
                            doSubmit={upsertOnAir}
                        />
                    </Col>
                </Row>
            </>)
            }
        </AppLayout>
    );
}

export default me;