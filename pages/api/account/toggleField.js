import { apiHandler, omit } from 'helpers/api'
import { DiscordAccountRepo, } from 'repos'

export default apiHandler({
    put: ToggleField,
});

async function ToggleField(req, res) {
    if (!req.body) throw 'Body is required'

    const {
        id,
        key,
    } = JSON.parse(req.body)

    if (!id) throw 'id is required'

    let x = await DiscordAccountRepo.toggleField(id, key, { humanize: ['lastLogin', 'createdAt', 'updatedAt'], serialize: true });

    return res.status(200).json(x)
}