import { useState, } from 'react';
import { 
    Button,
} from 'react-bootstrap'
import { FaTrash } from 'react-icons/fa';
import ClipLoader from "react-spinners/ClipLoader";

function DeleteButton ({ onClick, id, variant, disabled, }) {
    const [isDeleting, setIsDeleting] = useState(false)

    const _onClick = async (e) => {
        e.preventDefault()
        setIsDeleting(true)
        await onClick(id)
        setIsDeleting(false)
    }

    return (<Button
        size='md'
        variant={variant || 'danger'}
        onClick={_onClick}
        disabled={isDeleting || disabled}
    >
        {(isDeleting) 
         ? (<span>
            <ClipLoader color="#f81d1d" size={12} />
            &nbsp;Deleting...
        </span>)
         : (<FaTrash />)
        }
    </Button>)
}

export default DeleteButton