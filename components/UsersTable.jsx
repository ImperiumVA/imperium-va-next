import { useState, useEffect, useReducer, } from 'react';
import DataTable from 'react-data-table-component'
import { 
    Badge,
    Button,
    ButtonGroup,
} from 'react-bootstrap'
import DeleteButton from 'components/DeleteButton'

function UsersTable({ data, onDelete, toggleField, ...props }) {
    const columns = [
        {
            name: 'Username',
            cell: (row) => (<span>
                {row.username}
                {row.isAdmin && (<>{' '}<Badge bg='danger'>(Admin)</Badge></>)}
            </span>),
        },
        {
            name: 'Email',
            selector: (row) => row.email,
        },
        {
            name: 'Discord Username',
            cell: (row) => (<span>
                {`${row.username}#${row.discriminator}`}
            </span>),
        },
        {
            name: 'Last Login',
            cell: (row) => (<span>
                {row.humanized_lastLogin}
            </span>),
        },
        {
            name: 'First Login',
            cell: (row) => (<span>
                {row.humanized_createdAt}
            </span>),
        },
        {
            name: 'Is Enabled?',
            cell: ({ isEnabled, id, }) => (
            <Badge
                style={{
                    cursor: 'pointer',
                }}
                onClick={(e) => toggleField('isEnabled', id)} bg={(!isEnabled) ? 'danger' : 'success'}
            >
                {(isEnabled) ? 'Yes' : 'No'}
            </Badge>),
        },
        {
            name: 'actions',
            cell: (row) => (<ButtonGroup>
                <DeleteButton id={row.id} onClick={onDelete} />
            </ButtonGroup>)
        }
    ]

    return (data && data.length > 0)
        ? (<DataTable
            data={data}
            columns={columns}
        />)
        : (<p>No data</p>)
}

export default UsersTable;