import { apiHandler, omit } from 'helpers/api'
import DiscordAccountRepo from 'repos/DiscordAccountRepo'

export default apiHandler({
    put: ToggleAdmin,
});

async function ToggleAdmin(req, res) {
    const {
        id,
    } = req.query
    if (!id) throw 'ID is required'

    let x = await DiscordAccountRepo.toggleAdmin(id);
    return res.status(200).json(x)
}