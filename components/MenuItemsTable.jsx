import { useState, useEffect, useReducer, } from 'react';
import DataTable from 'react-data-table-component'
import { 
    Badge,
    Button,
    ButtonGroup,
    Form,
    InputGroup,
} from 'react-bootstrap'
import DeleteButton from 'components/DeleteButton'
import { FaBan, FaInfoCircle, FaPencilAlt, FaSave } from 'react-icons/fa';

function MenuItemsTable({ data, onDelete, onEdit, toggleField, ...props }) {
    const [state, setState] = useState({
        isEditing: false,
        isDeleting: false,
        editing: null,
        deleting: null,
    });

    const handleFieldChange = (e) => {
        e.preventDefault();

        setState({
            ...state,
            [e.target.name]: e.target.value,
        })
    }

    const columns = [
        {
            name: 'Name',
            cell: (row) => (<a href={`/admin/menus/${row.id}`}>{`${row.name} (${row.slug})`}</a>)
        },
        {
            name: 'Auth Required?',
            cell: ({ isAuthRequired, id, }) => (
            <Badge
                style={{
                    cursor: 'pointer',
                }}
                onClick={(e) => toggleField('isAuthRequired', id)} bg={(isAuthRequired) ? 'danger' : 'success'}
            >
                {(isAuthRequired) ? 'Yes' : 'No'}
            </Badge>),
        },
        {
            name: 'Admin Only?',
            cell: ({ adminOnly, id, }) => (
            <Badge
                style={{
                    cursor: 'pointer',
                }}
                onClick={(e) => toggleField('adminOnly', id)} bg={(adminOnly) ? 'danger' : 'success'}
            >
                {(adminOnly) ? 'Yes' : 'No'}
            </Badge>),
        },
        {
            name: 'Is Disabled?',
            cell: ({ isDisabled, id, }) => (
            <Badge
                style={{
                    cursor: 'pointer',
                }}
                onClick={(e) => toggleField('isDisabled', id)} bg={(isDisabled) ? 'danger' : 'success'}
            >
                {(isDisabled) ? 'Yes' : 'No'}
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

export default MenuItemsTable;