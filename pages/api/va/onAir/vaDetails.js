import { apiHandler, omit } from 'helpers/api'
import { VirtualAirlineRepo, } from 'repos'
import { OnAirService } from 'helpers/onair'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"

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

    let oaDetails = await OnAirService.queryCompanyDetails({ apiKey, companyId: vaId, })
    // let x = await OnAirCompanyRepo.toggleField(id, key);
    return res.status(200).json(oaDetails)
}