import { SessionProvider } from "next-auth/react"
import 'styles/globals.scss'
import { SSRProvider } from "react-bootstrap"
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <SSRProvider>
        <Component {...pageProps} />
      </SSRProvider>
    </SessionProvider>
  )
}