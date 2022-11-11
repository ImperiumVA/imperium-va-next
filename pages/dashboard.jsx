import AppLayout from 'layouts/AppLayout'
import { useRouter } from 'next/router'
import { MenuRepo } from 'repos'
import { AlertService, AlertType } from 'services';
import { Button, Row, Col, } from 'react-bootstrap'
import { useEffect } from 'react';

export async function getServerSideProps(ctx) {
    const menus = await MenuRepo.findEnabled({
        serialize: true,
        include: {
            items: true,
        },
    });

    return {
        props: {
            menus: {
                mainMenu: menus.filter((x) => x.slug === 'main-menu')[0],
                adminMenu: menus.filter((x) => x.slug === 'admin-menu')[0],
            },
        },
    }

    
}

export default function Dashboard({ menus }) {
    const router = useRouter()

    const emitNotice = (e) => {
        e.preventDefault()
        
        AlertService.notice('This is the test notice message body', {
            heading: 'Test Notice',
            autoClose: true,
        })
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
            <Row>
                <Col>
                    <Button variant='primary' onClick={emitNotice}>Emit a Test Notice</Button><br/><br/>
                </Col>
            </Row>
        </AppLayout>
    )
}
