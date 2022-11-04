import { useState, useEffect, useReducer, } from 'react';
import DataTable from 'react-data-table-component'
import { 
    Badge,
    Button,
    ButtonGroup,
} from 'react-bootstrap'
import { FaTrash } from 'react-icons/fa';

function DeleteButton ({ onClick, id }) {
    const [isDeleting, setIsDeleting] = useState(false)

    const _onClick = async (e) => {
        e.preventDefault()
        setIsDeleting(true)
        await onClick(id)
        setIsDeleting(false)
    }

    return (<Button
        size='md'
        variant='danger'
        onClick={_onClick}
        disabled={isDeleting}
    >
        {(isDeleting) 
         ? 'Deleting...'
         : (<FaTrash />)
        }
    </Button>)
}

function UsersTable({ data, onDelete, ...props }) {
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
                {row.lastLogin}
            </span>),
        },
        {
            name: 'actions',
            style: {
                textAlign: 'center',
            },
            cell: (row) => (<div className='text-center'><ButtonGroup>
                <DeleteButton id={row.id} onClick={onDelete} />
            </ButtonGroup></div>)
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