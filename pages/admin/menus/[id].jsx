import { useState, useEffect, useReducer, } from 'react';
import AppLayout from 'layouts/AppLayout'
import { Row, Col, } from 'react-bootstrap'
import { MenuRepo } from 'repos'
import Reducer from 'reducers';
import { MenuService, MenuItemService, } from 'services'
import MenuItemsTable from 'components/MenuItemsTable'
import AddMenuItem from 'components/AddMenuItem'
import { useRouter } from 'next/router'


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
    const [menuState, dispatch] = useReducer(Reducer, menu);
    const router = useRouter();

    const doMenuItemDelete = async (id) => {
        const x = await MenuItemService.delete(id);
        dispatch({ type: 'deleteItem', payload: id });

        return router.reload();
    }

    const toggleMenuItemField = async(key, id) => {
        const x = await MenuItemService.toggleField(id, key);
        dispatch({ type: 'updateItem', payload: x });
    }
    
    const doDelete = async (id) => {
        const x = await MenuService.delete(id);
        dispatch({ type: 'delete', payload: id });

        return router.reload();
    }

    const toggleField = async(key, id) => {
        const x = await MenuService.toggleField(id, key);
        dispatch({ type: 'update', payload: x });
    }

    const doCreate = async (values) => {
        const x = await MenuItemService.create(values);
        
        return router.reload();
    }


    return (
        <AppLayout
            menus={menus}
            heading={`${menu.name} Detail`}
        >
            <Row>
                <Col>
                    <MenuItemsTable
                        data={menuState.items}
                        onDelete={doMenuItemDelete}
                        toggleField={toggleMenuItemField}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <hr />
                </Col>
            </Row>
            <Row>
                <Col>
                    <AddMenuItem
                        menu={menu}
                        doCreate={doCreate}
                    />
                </Col>
            </Row>
        </AppLayout>
    );
}

export default MenuDetail;