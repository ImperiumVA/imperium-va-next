import OnAirApi from 'onair-api'

async function queryCompanyDetails({ companyId, apiKey, }, opts) {
    if (!companyId) throw 'No Company ID GUID provided.'
    if (!apiKey) throw 'No Company API Key provided.'

    const Api = new OnAirApi({
        apiKey: apiKey,
        companyId: companyId,
    })

    return await Api.getCompany()
}

async function queryAirportDetails({ companyId, apiKey, }, airportIdentifier, opts) {
    if (!companyId) throw 'No Company ID GUID provided.'
    if (!apiKey) throw 'No Company API Key provided.'

    const Api = new OnAirApi({
        apiKey: apiKey,
        companyId: companyId,
    })

    const onairAirportResults = await Api.getAirport(airportIdentifier);

    console.log(onairAirportResults)

    return onairAirportResults
}

export const OnAirService = {
    queryCompanyDetails,
    queryAirportDetails,
}

export default OnAirService