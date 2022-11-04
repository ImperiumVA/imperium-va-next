import AppLayout from 'layouts/AppLayout'
import { useRouter } from 'next/router'

export default function Dashboard() {
  const router = useRouter()

  return (
    <AppLayout
      heading='Dashboard'
    >
      
    </AppLayout>
  )
}
