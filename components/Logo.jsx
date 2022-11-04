import { Image, } from 'react-bootstrap'

function Logo({ width, height, alt, href}) {
    return (href) 
        ? (<a href={href}>
            <Image src='/logo.png' id='Logo' width={width} height={height} alt={alt || 'Logo'} />
        </a>)
        : (<Image src='/logo.png' id='Logo' width={width} height={height} alt={alt || 'Logo'} />)
}

export default Logo;