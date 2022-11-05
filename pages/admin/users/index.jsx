import { useState, useEffect, useReducer, } from 'react';
import AppLayout from 'layouts/AppLayout'
import { Row, Col, } from 'react-bootstrap'
import { MenuRepo, AccountRepo, } from 'repos'
import UsersTable from 'components/UsersTable'
import Reducer from 'reducers';
import { AccountService } from 'services'

export async function getServerSideProps(ctx) {
    const menus = await MenuRepo.findEnabled({
        serialize: true,
        include: {
            items: true,
        },
    });
    

    const users = await AccountRepo.findAll({
        serialize: true,
        humanize: ['lastLogin', 'createdAt', 'updatedAt'],
    });

    return {
        props: {
            menus: {
                mainMenu: menus.filter((x) => x.slug === 'main-menu')[0],
                adminMenu: menus.filter((x) => x.slug === 'admin-menu')[0],
            },
            users: users,
        }
    }
}

function UsersList({ users, menus }) {
    const [state, dispatch] = useReducer(Reducer, users);

    const doDelete = async (id) => {
        const x = await AccountService.delete(id);
        dispatch({ type: 'delete', payload: id });

        return x;
    }


    const toggleField = async(key, id) => {
        const x = await AccountService.toggleField(id, key);
        dispatch({ type: 'update', payload: x });
    }

    return (
        <AppLayout
            menus={menus}
            heading='Users List'
        >
            <Row>
                <Col>
                    <UsersTable
                        data={state}
                        onDelete={doDelete}
                        toggleField={toggleField}
                    />
                </Col>
            </Row>
        </AppLayout>
    );
}

export default UsersList;