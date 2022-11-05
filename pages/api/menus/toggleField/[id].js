import { apiHandler, omit } from 'helpers/api'
import { MenuRepo, } from 'repos'

export default apiHandler({
    put: ToggleField,
});

async function ToggleField(req, res) {
    const {
        id,
    } = req.query
    if (!id) throw 'ID is required'

    const {
        key
    } = JSON.parse(req.body)
    
    if (!key) throw 'Key is required'

    let x = await MenuRepo.toggleField(id, key);
    return res.status(200).json(x)
}