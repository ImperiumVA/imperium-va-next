import AppLayout from 'layouts/AppLayout'
import { useRouter } from 'next/router'
import { MenuRepo } from 'repos'
import { AlertService, AlertType } from 'services';
import { Button, } from 'react-bootstrap'
import { useEffect } from 'react';

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

    const emitDismissableAlert = (e) => {
        e.preventDefault()
        
        AlertService.notice('This is the dismissable test notice message body', {
            heading: 'dismissable Test Notice',
            autoClose: false,
            dismissible: true,
        })
    }

    const emitNonDismissableAlert = (e) => {
        e.preventDefault()
        
        AlertService.notice('This is the non-dismissable test notice message body', {
            heading: 'non-dismissable Test Notice',
            autoClose: false,
            dismissible: false,
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
                <Button variant='primary' onClick={emitDismissableAlert}>Emit Dismissable Alert</Button><br/><br/>
                <Button variant='primary' onClick={emitNonDismissableAlert}>Emit Non-Dismissable Alert</Button>
            </div>
        </AppLayout>
    )
}
