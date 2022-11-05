import { useState, useEffect, useReducer, } from 'react';
import AppLayout from 'layouts/AppLayout'
import { Row, Col, } from 'react-bootstrap'
import MenuRepo from 'repos/MenuRepo'
import Reducer from 'reducers';
import { MenuService } from 'services'
import MenusTable from 'components/MenusTable'

export async function getServerSideProps() {
    const menus = await MenuRepo.findEnabled({
        serialize: true,
        include: {
            items: true,
        },
    });
    
    const menusList = await MenuRepo.findAll({
        serialize: true,
        humanize: ['createdAt', 'updatedAt'],
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
            menusList,
        }
    }
}

function MenusList({ menus, menusList }) {
    const [state, dispatch] = useReducer(Reducer, menusList);
    
    const doDelete = async (id) => {
        const x = await MenuService.delete(id);
        dispatch({ type: 'delete', payload: id });

        return x;
    }

    
    const toggleField = async(key, id) => {
        const x = await MenuService.toggleField(id, key);
        dispatch({ type: 'update', payload: x });
    }

    return (
        <AppLayout
            menus={menus}
            heading='Menus'
        >
            <Row>
                <Col>
                    <MenusTable
                        data={state}
                        onDelete={doDelete}
                        toggleField={toggleField}
                    />
                </Col>
            </Row>
        </AppLayout>
    );
}

export default MenusList;