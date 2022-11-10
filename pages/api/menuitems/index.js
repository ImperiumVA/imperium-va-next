import { apiHandler, omit, slugify } from 'helpers/api'
import { MenuItemRepo } from 'repos'

export default apiHandler({
    post: Create,
});

async function Create(req, res) {
    if (!req.body) throw 'No body';

    const {
        name,
        label,
        href,
        isDisabled,
        isExternal,
        isAuthRequired,
        adminOnly,
        menuId,
    } = JSON.parse(req.body);
    
    console.log({
        name,
        label,
        href,
        isDisabled,
        isExternal,
        isAuthRequired,
        adminOnly,
        menuId,
    })

    if (!menuId) throw 'ID is required'

    let x = await MenuItemRepo.create({
        name,
        slug: slugify(name),
        label,
        href,
        isDisabled: (isDisabled && isDisabled === 'on') ? true : false,
        isExternal: (isExternal && isExternal === 'on') ? true : false,
        isAuthRequired: (isAuthRequired && isAuthRequired === 'on') ? true : false,
        adminOnly: (adminOnly && adminOnly === 'on') ? true : false,
        parent: {
            connect: {
                id: (typeof menuId === 'string') ? parseInt(menuId) : menuId,
            },
        },
    });

    return res.status(201).json(x)
}