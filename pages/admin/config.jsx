import { AppConfigRepo, MenuRepo, } from "repos";
import { AppLayout } from 'layouts';
import {
    Row,
    Col,

} from 'react-bootstrap';

export async function getServerSideProps(ctx) {
    const menus = await MenuRepo.findEnabled({
        serialize: true,
        include: {
            items: true,
        },
    });

    const config = await AppConfigRepo.getFirst({
        serialize: true,
    });

    return {
        props: {
            menus: {
                mainMenu: menus.filter((x) => x.slug === 'main-menu')[0],
                adminMenu: menus.filter((x) => x.slug === 'admin-menu')[0],
            },
            config,
        },
    }
}

function AppConfig({ menus, config, ...props }) {
    
    return (
        <AppLayout
            menus={menus}
            heading='App Config'
        >
            <Row>
                <Col>
                    <pre>
                        {JSON.stringify(config, null, 2)}
                    </pre>
                </Col>
            </Row>
        </AppLayout>
    );
}

export default AppConfig;