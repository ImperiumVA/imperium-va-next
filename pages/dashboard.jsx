import AppLayout from 'layouts/AppLayout'
import { useRouter } from 'next/router'
import { MenuRepo, AccountRepo, } from 'repos'
import { AlertService, AlertType } from 'services';
import { Button, Row, Col, Form, FloatingLabel, } from 'react-bootstrap'
import { useState, useEffect } from 'react';
import { DiscordService, } from 'services/DiscordService';
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"
import ClipLoader from "react-spinners/ClipLoader";

export async function getServerSideProps(ctx) {
    const session = await unstable_getServerSession(ctx.req, ctx.res, authOptions)

    if (!session) {
        return {
            redirect: {
                destination: '/auth/signin',
                permanent: true,
            },
        }
    }
    const { user } = session
    const account = await AccountRepo.findById(user.accountId, {
        serialize: true,
        include: {
            companies: {
                include: {
                    owner: true,
                    virtualAirline: true,
                },
            }
        }
    })

    const menus = await MenuRepo.findEnabled({
        serialize: true,
        include: {
            items: true,
        },
    });

    return {
        props: {
            user,
            account,
            menus: {
                mainMenu: menus.filter((x) => x.slug === 'main-menu')[0],
                adminMenu: menus.filter((x) => x.slug === 'admin-menu')[0],
            },
        },
    }

    
}

export default function Dashboard({ user, account, menus }) {
    const [discordMessage, setDiscordMessage] = useState('')
    const [discordMessageSending, setDiscordMessageSending] = useState(false)

    const router = useRouter()

    const emitNotice = (e) => {
        e.preventDefault()
        
        AlertService.notice('This is the test notice message body', {
            heading: 'Test Notice',
            autoClose: true,
        });
    }

    const emitDiscordMessage = async (e) => {
        e.preventDefault()
        if (discordMessage.length > 0) {
            setDiscordMessageSending(true)

            await DiscordService.sendMessage(discordMessage, 'discord').then((res) => {
                setDiscordMessageSending(false)
                setDiscordMessage('')
                AlertService.success('Message sent successfully');
            }).catch((err) => {
                setDiscordMessageSending(false)
                AlertService.error('Error sending message');
            });
        }
    }
    
    return (
        <AppLayout
            menus={menus}
            heading='Dashboard'
        >
            <Row>
                <Col>
                    <p>
                        Cool stuff like stats, graphs and stuff will eventually go here
                    </p>
                </Col>
            </Row>
            <Row className='mb-3'>
                <Col>
                    <Button variant='primary' onClick={emitNotice}>Emit a Test site notice</Button>
                </Col>
            </Row>

            {(account.isAdmin)
                ? (<div id='DiscordMessageSender'>
                    <Form>
                        <Row>
                            <Col md={3}>
                                <FloatingLabel label='Discord Message' className='mb-3'>
                                    <Form.Control
                                        as='textarea'
                                        name='discordMessage'
                                        id='discordMessage'
                                        rows={3}
                                        onChange={e => setDiscordMessage(e.target.value)}
                                    />
                                </FloatingLabel>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Button
                                    variant='primary'
                                    onClick={emitDiscordMessage}
                                    disabled={(discordMessage.length <= 0 || discordMessageSending)}>
                                        {(discordMessageSending) 
                                            ? (<span>
                                                <ClipLoader color="#36d7b7" size={12} />
                                                &nbsp;
                                                Emitting
                                            </span>)
                                            : (<span>Emit a Test Discord Message</span>)
                                        }
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </div>)
                : null
            }
        </AppLayout>
    )
}
