import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from 'react-bootstrap'

function SignInButton({ variant}) {
    const { data: session } = useSession()

    return (session)
        ? (<>
            Signed in as {session.user.email}
            <br />
            <Button 
                onClick={() => signOut()}
            >
                Sign out
            </Button>
        </>)
        : (<>
            Not signed in
            <br />
            <Button 
                onClick={() => signIn()}
            >
                Sign in
            </Button>
        </>)
}

export default SignInButton;