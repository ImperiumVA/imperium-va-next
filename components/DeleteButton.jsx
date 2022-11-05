import { useState, } from 'react';
import { 
    Button,
} from 'react-bootstrap'
import { FaTrash } from 'react-icons/fa';

function DeleteButton ({ onClick, id, disabled, }) {
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
        disabled={isDeleting || disabled}
    >
        {(isDeleting) 
         ? 'Deleting...'
         : (<FaTrash />)
        }
    </Button>)
}

export default DeleteButton