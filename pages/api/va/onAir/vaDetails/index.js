import { apiHandler, omit } from 'helpers/api'
import { OnAirVARepo, } from 'repos'
import { OnAirService } from 'helpers/onair'

export default apiHandler({
    put: QueryOnAirVADetails,
});

async function QueryOnAirVADetails(req, res) {

    const {
        apiKey,
        vaId,
    } = JSON.parse(req.body)
    
    if (!apiKey) throw 'OnAir API Key is required'
    if (!vaId) throw 'OnAir VA ID is required'

    let oaDetails = await OnAirService.queryVADetails({ apiKey, vaId, })
    // let x = await OnAirVARepo.toggleField(id, key);
    return res.status(200).json(oaDetails)
}