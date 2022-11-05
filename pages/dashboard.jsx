import AppLayout from 'layouts/AppLayout'
import { useRouter } from 'next/router'
import { MenuRepo } from 'repos'


export async function getServerSideProps(ctx) {
    const menus = await MenuRepo.findAll({
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

    return (
        <AppLayout
            menus={menus}
            heading='Dashboard'
        >
            <div>
                Cool stuff like stats, graphs and stuff will eventually go here
            </div>
        </AppLayout>
    )
}
