import AppLayout from 'layouts/AppLayout'
import { signIn, signOut, useSession } from "next-auth/react"
import { MenuRepo } from 'repos'
import { CompanyService } from 'services';
import OnAirForm from 'components/OnAirForm'
import { Row, Col, } from 'react-bootstrap'

export async function getServerSideProps(ctx) {
    const menus = await MenuRepo.findAll({
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

function me({
    menus,
}) {
    const { data: session, status } = useSession()
    const profileImage = session?.user?.image || '/ProfilePhoto.jpg'
    
    const upsertOnAir = async (values) => {
        const x = await CompanyService.upsert(session.user.id, values)
        return x
    }

    return (
        <AppLayout
            menus={menus}
            heading={`Hi, ${session?.user?.name}`}
        >
            <Row>
                <Col>
                    <OnAirForm
                        doSubmit={upsertOnAir}
                    />
                </Col>
            </Row>
        </AppLayout>
    );
}

export default me;