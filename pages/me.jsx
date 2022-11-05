import React from 'react';
import AppLayout from 'layouts/AppLayout'
import { useSession, } from "next-auth/react"
import { unstable_getServerSession } from "next-auth/next"
import { MenuRepo } from 'repos'
import { CompanyService } from 'services';
import OnAirForm from 'components/OnAirForm'
import LevelBar from 'components/LevelBar'
import { Row, Col, Form, FloatingLabel, Button, } from 'react-bootstrap'
import { authOptions } from "pages/api/auth/[...nextauth]"
import { useRouter, } from 'next/router';
import OnAirReducer from 'reducers/OnAirReducer';

export async function getServerSideProps(ctx) {
    const { 
        req, 
        res
    } = ctx
    
    const {
        user,
        ...session
    } = await unstable_getServerSession(
        req,
        res,
        authOptions
    )

    console.log(user);
    
    const menus = await MenuRepo.findEnabled({
        serialize: true,
        include: {
            items: true,
        },
    });
    
    return {
        props: {
            user: null,
            menus: {
                mainMenu: menus.filter((x) => x.slug === 'main-menu')[0],
                adminMenu: menus.filter((x) => x.slug === 'admin-menu')[0],
            },
            onAir: {
                company: null,
            }
        },
    }
}

function me({
    menus,
    onAir,
    user,
}) {
    const upsertOnAir = async (values) => {
        if (!user) return;

        const x = await CompanyService.upsert(user.accountId, values)
        return x
    }

    const syncOnAir = async () => {
        console.log('syncOnAir')

        if (!user) return;

        const x = await CompanyService.upsert(user.accountId, {
            apiKey: onAir.company.companyApiKey,
            companyId: onAir.company.companyId
        })

        return x
    }

    return (
        <AppLayout
            menus={menus}
            heading={(user) ? `Hi, ${user.name}` : undefined}
        >
            {(onAir && onAir.company)
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
                                defaultValue={onAir.company.airlineCode}
                                disabled={true}
                            />
                        </FloatingLabel>
                    </Col>
                    <Col md={7}>
                        <FloatingLabel label='Company Name'>
                            <Form.Control
                                type='text'
                                name='name'
                                defaultValue={onAir.company.name}
                                disabled={true}
                            />
                        </FloatingLabel>
                    </Col>
                    <Col md={3}>
                        <FloatingLabel label='Last Sync'>
                            <Form.Control
                                type='text'
                                name='humanized_onAirSyncedAt'
                                defaultValue={onAir.company.humanized_onAirSyncedAt}
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
                                defaultValue={onAir.company.humanized_lastConnection}
                                disabled={true}
                            />
                        </FloatingLabel>
                    </Col>
                    <Col md={3}>
                        <FloatingLabel label='Last Pay Date'>
                            <Form.Control
                                type='text'
                                name='humanized_lastWeeklyManagementsPaymentDate'
                                defaultValue={onAir.company.humanized_lastWeeklyManagementsPaymentDate}
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
                        {(onAir.company.level) &&
                            <>
                                <h5>{`Level ${onAir.company.level}`}</h5>
                                <em style={{
                                    fontSize: '14px'
                                }}>{`${onAir.company.levelXP}/${onAir.company.level * 1000}`}</em>
                                <LevelBar xp={onAir.company.levelXP} level={onAir.company.level} levelXP={onAir.company.level * 1000} />
                                {onAir.company.reputation &&
                                <p style={{
                                    fontSize: '14px'
                                }}>
                                    {`Reputation: ${(onAir.company.reputation * 100).toFixed(2)}%`}
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
                        <p>It looks like you haven&apos;t linked your On Air Company yet.<br/>
                        Please add Your OnAir Company details below to associate your Discord account with your OnAir Company.
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