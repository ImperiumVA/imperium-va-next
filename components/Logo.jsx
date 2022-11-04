import LogoPng from './Logo.png';
import { Image, } from 'react-bootstrap'

function Logo() {
    return (
        <Image src={LogoPng} alt="Logo" />
    );
}

export default Logo;