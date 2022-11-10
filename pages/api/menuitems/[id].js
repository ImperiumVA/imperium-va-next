import { apiHandler, omit } from 'helpers/api'
import { MenuItemRepo } from 'repos'

export default apiHandler({
    delete: Delete,
});

async function Delete(req, res) {
    const {
        id,
    } = req.query
    if (!id) throw 'ID is required'

    let x = await MenuItemRepo.destroy(id);
    return res.status(200).json(x)
}