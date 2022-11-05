import AppLayout from 'layouts/AppLayout'
import { useRouter } from 'next/router'
import { MenuRepo } from 'repos'
import { AlertService, AlertType } from 'services';
import { Button, } from 'react-bootstrap'

export async function getServerSideProps(ctx) {
    const menus = await MenuRepo.findEnabled({
        serialize: true,
        include: {
            items: true,
        },
    });

    return {
        props: {
            menus: {
                mainMenu: menus.filter((x) => x.slug === 'main-menu')[0],
                adminMenu: menus.filter((x) => x.slug === 'admin-menu')[0],
            },
        },
    }

    
}

export default function Dashboard({ menus }) {
    const router = useRouter()

    const emitAlert = (e) => {
        e.preventDefault()
        
        AlertService.success('This is a test alert',{
            heading: 'Test Alert',
            type: AlertType.info,
            dismissable: true,
            autoClose: false,
        })
    }

    return (
        <AppLayout
            menus={menus}
            heading='Dashboard'
        >
            <div>
                <p>
                    Cool stuff like stats, graphs and stuff will eventually go here
                </p>
                <Button variant='primary' onClick={emitAlert}>Emit Alert</Button>
            </div>
        </AppLayout>
    )
}
