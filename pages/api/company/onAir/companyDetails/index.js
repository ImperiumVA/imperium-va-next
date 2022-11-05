import { apiHandler, omit } from 'helpers/api'
import { OnAirCompanyRepo, } from 'repos'
import { OnAirService } from 'helpers/onair'

export default apiHandler({
    put: QueryOnAirCompanyDetails,
});

async function QueryOnAirCompanyDetails(req, res) {

    const {
        apiKey,
        companyId,
    } = JSON.parse(req.body)
    
    if (!apiKey) throw 'OnAir API Key is required'
    if (!companyId) throw 'OnAir Company ID is required'

    let oaDetails = await OnAirService.queryCompanyDetails({ apiKey, companyId, })
    // let x = await OnAirCompanyRepo.toggleField(id, key);
    return res.status(200).json(oaDetails)
}