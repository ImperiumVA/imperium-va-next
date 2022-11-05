import { useState, useEffect, useReducer, } from 'react';
import AppLayout from 'layouts/AppLayout'
import { Row, Col, } from 'react-bootstrap'
import { MenuRepo } from 'repos'
import Reducer from 'reducers';
import { MenuService, MenuItemService, } from 'services'
import MenuItemsTable from 'components/MenuItemsTable'


export async function getServerSideProps(ctx) {
    const { id } = ctx.params;
    
    const menus = await MenuRepo.findEnabled({
        serialize: true,
        include: {
            items: true,
        },
    });

    const menu = await MenuRepo.findById(id, {
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
            menu: menu,
        }
    }
}

function MenuDetail({ menus, menu, }) {
    const [state, dispatch] = useReducer(Reducer, menu);
    
    const doMenuItemDelete = async (id) => {
        const x = await MenuItemService.delete(id);
        dispatch({ type: 'delete', payload: id });

        return x;
    }

    const toggleMenuItemField = async(key, id) => {
        const x = await MenuItemService.toggleField(id, key);
        dispatch({ type: 'update', payload: x });
    }
    
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
            heading={`${menu.name} Detail`}
        >
            <Row>
                <Col>
                    <MenuItemsTable
                        data={state.items}
                        onDelete={doMenuItemDelete}
                        toggleField={toggleMenuItemField}
                    />
                </Col>
            </Row>
        </AppLayout>
    );
}

export default MenuDetail;