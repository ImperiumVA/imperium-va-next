import {
    Nav,
    NavDropdown,
    Container,
    Row,
    Col,
    Image,
} from 'react-bootstrap';
import { FaCogs, } from 'react-icons/fa'
import { signIn, signOut, useSession } from "next-auth/react"

function HomeHeader({ menus, }) {
        
    const { data: session, status } = useSession()
    const profileImage = session?.user?.image || '/ProfilePhoto.jpg'

    const doSignOut = (e) => {
        e.preventDefault()
        signOut('discord')
    }

    const doSignIn = (e) => {
        e.preventDefault()
        signIn('discord')
    }

    const buildMenu = (items) => { 
        return (items && items.length > 0) 
        ? items.map((menu, k) => (<Nav.Item key={k}>
            <Nav.Link href={menu.href}>{menu.label}</Nav.Link>
        </Nav.Item>))
        : null;
    }

    const isAuthenticated = (session && session.user) ? true : false;
    return (
        <Container>
            <Row>
                <Col md={8}>
                    <Nav defaultActiveKey="/" className='justify-content-center'>
                        {(menus && menus.mainMenu.items.length > 0) &&
                            menus.mainMenu.items.map(({ isAuthRequired, href, label, }, k) => {
                                
                                return ((isAuthRequired && isAuthenticated) || (!isAuthRequired))
                                ? (<Nav.Item key={k}>
                                    <Nav.Link href={href}>{label}</Nav.Link>
                                </Nav.Item>)
                                : null;
                            })
                        }
                    </Nav>
                </Col>
                <Col md={4}>
                    <Nav className='justify-content-end'>
                        {(session && session.user)
                        ? (<>
                            <NavDropdown title={(<Image src={profileImage} roundedCircle width={30} height={30} alt='Profile Photo' />)} id="basic-nav-dropdown" >
                                <NavDropdown.Item href="/me">Profile</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={doSignOut}>Sign Out</NavDropdown.Item>
                            </NavDropdown>
                            {(session.user.isAdmin === true) && (
                            <NavDropdown title={(<FaCogs />)} id="admin-nav-dropdown">
                                <NavDropdown.Item href="/admin/users">
                                    Manage Users
                                </NavDropdown.Item>
                                <NavDropdown.Item href="/admin/menus">
                                    Manage Menus
                                </NavDropdown.Item>
                            </NavDropdown>
                            )}
                        </>)
                        : (<Nav.Link onClick={doSignIn}>Sign in</Nav.Link>)
                        }  
                    </Nav>
                </Col>
            </Row>
        </Container>
    );
}

export default HomeHeader;