import { useState, } from 'react'
// import { signIn, signOut, useSession } from "next-auth/react"
import { Navbar, Container, Nav, NavDropdown, Image } from "react-bootstrap"

// The approach used in this component shows how to build a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.
const Menu = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "About",
    href: "/about",
  },
]

const initialState = {
  isLoading: false,
  color: 'dark',
}

export default function Header() {
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
    // signOut()
  }

  const doSignIn = (e) => {
    e.preventDefault()
    // signIn()
  }

  // const { data: session, status } = useSession()
  // const profileImage = session?.user?.image || '/ProfilePhoto.jpg'

  return (<Navbar bg={color} variant={color} expand="lg" className='mb-3'>
    <Container>
      <Navbar.Brand href="/">
        <Image
          src="/Logo.png"
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
          {Menu.map((item, i) => (<Nav.Link key={i} href={item.href}>{item.name}</Nav.Link>))}
        </Nav>
        <Nav className='justify-content-end'>
            <Nav.Link href={`/api/auth/signin`} onClick={(e) => {doSignIn}}>Sign in</Nav.Link>
        </Nav>
        
      </Navbar.Collapse>
    </Container>
  </Navbar>)
}
