import { SessionProvider } from "next-auth/react"
import 'styles/globals.scss'
import { SSRProvider } from "react-bootstrap"
import Alerts from 'components/Alert'

export default function App(props) {

  const {
    Component,
    pageProps: { session, ...pageProps },
  } = props

  return (
    <SessionProvider session={session}>
      <SSRProvider>
        <Component {...pageProps} />
        <Alerts />
      </SSRProvider>
    </SessionProvider>
  )
}