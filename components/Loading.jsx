import { FaSpinner } from 'react-icons/fa';
import { IconContext } from 'react-icons';

function Loading() {
    return (
        <div className="loading-component">
            <div className='icon-container'>
                <FaSpinner className="loading-spinner" />
            </div>
        </div>
    );
}

export default Loading;