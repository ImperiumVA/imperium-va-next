import { useState, } from 'react'
import { signIn, signOut, useSession } from "next-auth/react"
import { Navbar, Container, Nav, NavDropdown, Image } from "react-bootstrap"
import { FaCogs, } from 'react-icons/fa'
// The approach used in this component shows how to build a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.
const initialState = {
  isLoading: false,
  color: 'dark',
}

export default function Header({ menus: { mainMenu, adminMenu }, }) {
  const [state, setState] = useState(initialState)
  const {
    color,
    isLoading,
  } = state

  const toggleLoading = () => {
    setState({
      ...state,
      isLoading: !isLoading,
    })
  }

  const toggleColor = () => {
    setState({
      ...state,
      color: color === 'light' ? 'dark' : 'light',
    })
  }

  const doSignOut = (e) => {
    e.preventDefault()
    signOut('discord')
  }

  const doSignIn = (e) => {
    e.preventDefault()
    signIn('discord')
  }

  const { data: session, status } = useSession()
  const profileImage = session?.user?.image || '/ProfilePhoto.jpg'

  return (<Navbar bg={color} variant={color} expand="lg" className='mb-3'>
    <Container>
      <Navbar.Brand href="/">
        <Image
          src="/logo.png"
          width={30}
          height={30}
          className="d-inline-block align-top"
          alt="Logo"
        />{' '}
        Imperium VA
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="main-navbar-nav" />
      <Navbar.Collapse id="main-navbar-nav">
        <Nav className="me-auto">
        {(mainMenu && mainMenu.items.length > 0) &&
            mainMenu.items.map((item, i) => (<Nav.Link key={i} href={item.href}>{item.name}</Nav.Link>))
        }
        </Nav>
        <Nav className='justify-content-end'>
            {(session && session.user)
                ? (<>
                    <NavDropdown title={(<>
                        <Image src={profileImage} roundedCircle width={30} height={30} alt='Profile Photo' />{' '}{session.user.name}
                    </>)} id="basic-nav-dropdown">
                        <NavDropdown.Item href="/me">Profile</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={doSignOut}>Sign Out</NavDropdown.Item>
                    </NavDropdown>
                    {(session.user.isAdmin === true) && (
                    <NavDropdown title={(<FaCogs />)} id="admin-nav-dropdown">
                        {(adminMenu && adminMenu.items.length > 0)
                        ? adminMenu.items.map((menuItem, k) => (<NavDropdown.Item key={k} href={menuItem.href}>
                            {menuItem.label}
                        </NavDropdown.Item>))
                        : null}
                    </NavDropdown>
                    )}
                </>)
                : (
                    <Nav.Link onClick={doSignIn}>Sign in</Nav.Link>
                )
            }  
        </Nav>
        
      </Navbar.Collapse>
    </Container>
  </Navbar>)
}
