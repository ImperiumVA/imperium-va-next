const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
async function main() {

    const roles = [
        {
            name: 'Admin',
            slug: 'admin',
        },
        {
            name: 'User',
            slug: 'user',
        },
        {
            name: 'VA Pilot',
            slug: 'va-pilot'
        },
        {
            name: 'VA Dispatcher',
            slug: 'va-dispatcher'
        },
    ];

    const menus = [
        {
            slug: 'main-menu',
            name: 'Main Menu',
            order: 0,
            adminOnly: false,
            isDisabled: false,
            isAuthRequired: true,
            items: [
                {
                    slug: 'home',
                    name: 'Home',
                    href: '/',
                    label: 'Home',
                    isAuthRequired: false,
                    adminOnly: false,
                },
                {
                    slug: 'dashboard',
                    name: 'Dashboard',
                    href: '/dashboard',
                    label: 'Dashboard',
                    isAuthRequired: true,
                    adminOnly: false,
                },
                {
                    slug: 'onair',
                    name: 'OnAir',
                    href: '/onair',
                    label: 'OnAir',
                    isAuthRequired: true,
                    adminOnly: false,
                },
            ]
        },
        {
            slug: 'admin-menu',
            name: 'Admin Menu',
            order: 0,
            adminOnly: true,
            isDisabled: false,
            isAuthRequired: true,
            items: [
                {
                    slug: 'manage-users',
                    name: 'Manage Users',
                    href: '/admin/users',
                    label: 'Manage Users',
                    isAuthRequired: true,
                    adminOnly: true,
                },
                {
                    slug: 'manage-menus',
                    name: 'Manage Menus',
                    href: '/admin/menus',
                    label: 'Manage Menus',
                    isAuthRequired: true,
                    adminOnly: true,
                },
            ]
        }
    ]

    // roles.forEach(async (role) => {
    //     const x = await prisma.role.upsert({
    //         where: {
    //             slug: role.slug,
    //         },
    //         update: role,
    //         create: role,
    //     })
    //     console.log(`Role ${x.name} upserted ✅`)
    // })

    menus.forEach(async (menu) => {
        const x = await prisma.menu.upsert({
            where: {
                slug: menu.slug,
            },
            create: {
                slug: menu.slug,
                name: menu.name,
                order: menu.order,
                adminOnly: menu.adminOnly,
                isDisabled: menu.isDisabled,
                isAuthRequired: menu.isAuthRequired,
                items: {
                    createMany: {
                        data: menu.items
                    },
                }
            },
            update: {},
        })
        
        console.log(`${x.name} upserted ✅`)
    })
    
}

main()
.then(() => {
    console.log('Done')
})
.catch((e) => {
    console.error(e);
    process.exit(1);
})