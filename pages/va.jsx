import AppLayout from 'layouts/AppLayout'
import { useRouter } from 'next/router'
import { MenuRepo, } from 'repos'
import VirtualAirlineRepo from 'repos/VirtualAirlineRepo'
import { AlertService, AlertType } from 'services';
import { Button, Row, Col, } from 'react-bootstrap'
import { useEffect } from 'react';
import AddVA from 'components/AddVA';
import { VirtualAirlineService } from 'services';
export async function getServerSideProps(ctx) {
    const menus = await MenuRepo.findEnabled({
        serialize: true,
        include: {
            items: true,
        },
    });

    const va = await VirtualAirlineRepo.findAll({
        serialize: true,
        include: {
            members: true,
        }
    })



    return {
        props: {
            menus: {
                mainMenu: menus.filter((x) => x.slug === 'main-menu')[0],
                adminMenu: menus.filter((x) => x.slug === 'admin-menu')[0],
            },
            va,
        },
    }   
}

function VA({ menus, va, ...props }) {
    const router = useRouter();

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

    return (
        <AppLayout
            menus={menus}
            heading='VA'
        >
            <div>
                {(va && va.length > 0) ?
                (<pre>
                    {JSON.stringify(va, null, 2)}
                </pre>)
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
                            />
                        </Col>
                    </Row>
                </>)}
            </div>
        </AppLayout>
    );
}

export default VA;