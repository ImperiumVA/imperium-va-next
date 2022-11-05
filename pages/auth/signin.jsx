import { HomeLayout } from "layouts"
import { getProviders, signIn } from "next-auth/react"
import { useEffect } from "react"

export async function getServerSideProps(context) {
    const providers = await getProviders()
    return {
      props: { providers },
    }
  }

export default function SignIn({ providers }) {
    useEffect(() => {
        signIn('discord')
    });
    return null
}