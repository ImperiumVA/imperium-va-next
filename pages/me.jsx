import { useState, } from 'react';
import AppLayout from 'layouts/AppLayout'
import { unstable_getServerSession } from "next-auth/next"
import { MenuRepo } from 'repos'
import { CompanyService } from 'services';
import OnAirForm from 'components/OnAirForm'
import LevelBar from 'components/LevelBar'
import { Row, Col, Form, FloatingLabel, Button, } from 'react-bootstrap'
import { authOptions } from "pages/api/auth/[...nextauth]"
import { useRouter, } from 'next/router';
import { OnAirCompanyRepo } from 'repos';

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
    
    const company = await OnAirCompanyRepo.findByOwnerId(user.accountId, {
        serialize: true,
        include: {
            owner: true,
        },
        humanize: [
            'createdAt', 
            'updatedAt', 
            'onAirSyncedAt', 
            'lastConnection', 
            'lastReportDate', 
            'creationDate', 
            'pausedDate', 
            'lastWeeklyManagementsPaymentDate'
        ],
    });

    return {
        props: {
            user: user,
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

function Me({
    menus,
    onAir,
    user,
}) {
    const [isSyncing, setIsSyncing] = useState(false);
    const router = useRouter();
    const upsertOnAir = async (values) => {
        if (!user) {
            console.log('no user');
            return;
        }
        if (!values) {
            console.log('no values');
            return;
        }

        console.log(`upsertOnAir`, values);

        const x = await CompanyService.upsert(user.accountId, values)
        router.push('/me');
        return x
    }

    const syncOnAir = async (e) => {
        e.preventDefault();
        setIsSyncing(true);

        if (!user) {
            console.log('no user');
            return;
        }

        const x = await CompanyService.upsert(user.accountId, {
            apiKey: onAir.company.companyApiKey,
            companyId: onAir.company.companyId
        })

        setIsSyncing(false);
        
        router.push('/me');

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
                            Thanks for adding your OnAir Company to the platform. <br/>Your Discord account has been linked to your OnAir Company. <br/>Stay tuned to the Discord channel for new features and updates.
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
                                alt={onAir.onAirSyncedAt}
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
                                alt={onAir.lastConnection}
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
                                alt={onAir.lastWeeklyManagementsPaymentDate}
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
                        <Button variant='primary' onClick={syncOnAir} disabled={(onAir.company.canSync !== true)}>
                            {(isSyncing)
                                ? 'Syncing...'
                                : (onAir.company.canSync === true)
                                    ? 'Request Manual Sync'
                                    : (onAir.company.onAirSyncedAt) ? 'You can sync again in 1 min' : 'Request Manual Sync'
                            }
                        </Button>
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

export default Me;