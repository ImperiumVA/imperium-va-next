import { HomeLayout } from "layouts"
import { getProviders, signIn } from "next-auth/react"

export async function getServerSideProps(context) {
    const providers = await getProviders()
    return {
      props: { providers },
    }
  }

export default function SignIn({ providers }) {
  return (
    <HomeLayout>
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button onClick={() => signIn(provider.id)}>
            Sign in with {provider.name}
          </button>
        </div>
      ))}
    </HomeLayout>
  )
}