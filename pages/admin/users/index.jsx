import { useState, useEffect, useReducer, } from 'react';
import AppLayout from 'layouts/AppLayout'
import { Row, Col, } from 'react-bootstrap'
import DiscordAccountRepo from 'repos/DiscordAccountRepo'
import MenuRepo from 'repos/MenuRepo'
import UsersTable from 'components/UsersTable'
import UserReducer from 'reducers/UserReducer';
import { AccountService } from 'services'

export async function getServerSideProps(ctx) {
    const menus = await MenuRepo.findAll({
        serialize: true,
        include: {
            items: true,
        },
    });

    const users = await DiscordAccountRepo.findAll({
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
    const [state, dispatch] = useReducer(UserReducer, users);

    const doDelete = async (id) => {
        const x = await AccountService.delete(id);
        dispatch({ type: 'delete', payload: id });

        return x;
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
                    />
                </Col>
            </Row>
        </AppLayout>
    );
}

export default UsersList;