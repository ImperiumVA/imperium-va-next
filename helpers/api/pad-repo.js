import prisma from 'helpers/prisma'

export const worldRepo = {
    getAll,
    getById,
    getByUuid,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return  await prisma.world.findMany()
}


async function getByUuid(uuid) {
    if (!uuid) throw 'World UUID is required'

    const x = await prisma.world.findUnique({ 
        where: {
            uuid: uuid
        }
    })

    return x;
}

async function getById(id) {
    if (!id) throw 'ID is required'

    const x = await prisma.world.findUnique({ 
        where: {
            id: parseInt(id)
        }
    })

    return x;
}

async function create(world) {

    const x = await prisma.world.create({
        data: {
            isSurvival: world.isSurvival,
            isHumanOnly: world.isHumanOnly,
            uuid: world.uuid,
            name: world.name,
            shortName: world.shortName,
            enableEconomicBalance: world.enableEconomicBalance,
        }
    })

    return x
}

async function update(id, params) {
    const x = await prisma.world.update({
        where: {
            id: id,
        },
        data: {
            ...params
        }
    })

    return x
}

// prefixed with underscore '_' because 'delete' is a reserved word in javascript
async function _delete(id) {

    const x = await prisma.world.delete({
        where: {
            id: parseInt(id)
        }
    })

    return x
}