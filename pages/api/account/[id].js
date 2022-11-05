import { apiHandler, omit } from 'helpers/api'
import { DiscordAccountRepo, } from 'repos'

export default apiHandler({
    put: Update,
    delete: Delete,
});


async function Update(req, res) {
    const {
        id,
    } = req.query
    if (!id) throw 'ID is required'
    if (!req.body) throw 'Body is required'

    const {
        username,
        email,
        locale,
        verified,
        isAdmin,
    } = req.body

    let x = await DiscordAccountRepo.update(id, {
        username,
        email,
        locale,
        verified,
        isAdmin,
    }, {
        serialize: true,
    });

    return res.status(200).json(x)
}

async function Delete(req, res) {
    const {
        id,
    } = req.query
    if (!id) throw 'ID is required'

    let x = await DiscordAccountRepo.destroy(id);

    return res.status(200).json(x)
}