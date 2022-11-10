import { unstable_getServerSession } from "next-auth/next"
import { apiHandler, omit } from 'helpers/api'
import { CompanyRepo, } from 'repos'
import { OnAirService } from 'helpers/onair'
import { authOptions } from "pages/api/auth/[...nextauth]"

export default apiHandler({
    put: UpsertCompany,
});

async function UpsertCompany(req, res) {
    const session = await unstable_getServerSession(
        req,
        res,
        authOptions
    )

    const {
        user
    } = session

    if (!user) {
        return res.redirect('/auth/signin');
    }

    const {
        name,
        identifier,
        companyId,
        apiKey,
    } = JSON.parse(req.body)

    if (!apiKey) throw 'OnAir API Key is required'
    if (!companyId) throw 'OnAir Company ID is required'

    let oaDetails = await OnAirService.queryCompanyDetails({ apiKey, companyId, })
    
    const newCompany = {
        name: oaDetails.Name, // String
        guid: oaDetails.Id, // String
        apiKey: apiKey, // String
        airlineCode: oaDetails.AirlineCode, // String
        lastConnection: (oaDetails.LastConnection) ? new Date(oaDetails.LastConnection) : null, // DateTime
        lastReportDate: (oaDetails.LastReportDate) ? new Date(oaDetails.LastReportDate) : null, // DateTime
        reputation: oaDetails.Reputation, // Float
        creationDate: (oaDetails.CreationDate) ? new Date(oaDetails.CreationDate) : null, // DateTime
        difficultyLevel: oaDetails.DifficultyLevel, // Int
        uTCOffsetinHours: oaDetails.UTCOffsetinHours, // Int
        paused: oaDetails.Paused, // Boolean
        pausedDate: (oaDetails.PausedDate) ? new Date(oaDetails.PausedDate) : null, // DateTime
        level: oaDetails.Level, // Int
        levelXP: oaDetails.LevelXP, // Int
        transportEmployeeInstant: oaDetails.TransportEmployeeInstant, // Boolean
        transportPlayerInstant: oaDetails.TransportPlayerInstant, // Boolean
        forceTimeInSimulator: oaDetails.ForceTimeInSimulator, // Boolean
        useSmallAirports: oaDetails.UseSmallAirports, // Boolean
        useOnlyVanillaAirports: oaDetails.UseOnlyVanillaAirports, // Boolean
        enableSkillTree: oaDetails.EnableSkillTree, // Boolean
        checkrideLevel: oaDetails.CheckrideLevel, // Int
        enableLandingPenalities: oaDetails.EnableLandingPenalities, // Boolean
        enableEmployeesFlightDutyAndSleep: oaDetails.EnableEmployeesFlightDutyAndSleep, // Boolean
        aircraftRentLevel: oaDetails.AircraftRentLevel, // Int
        enableCargosAndChartersLoadingTime: oaDetails.EnableCargosAndChartersLoadingTime, // Boolean
        inSurvival: oaDetails.InSurvival, // Boolean
        payBonusFactor: oaDetails.PayBonusFactor, // Int
        enableSimFailures: oaDetails.EnableSimFailures, // Boolean
        disableSeatsConfigCheck: oaDetails.DisableSeatsConfigCheck, // Boolean
        realisticSimProcedures: oaDetails.RealisticSimProcedures, // Boolean
        travelTokens: oaDetails.TravelTokens, // Int
        currentBadgeId: oaDetails.CurrentBadgeId, // String
        currentBadgeUrl: oaDetails.CurrentBadgeUrl, // String
        currentBadgeName: oaDetails.CurrentBadgeName, // String
        lastWeeklyManagementsPaymentDate: (oaDetails.LastWeeklyManagementsPaymentDate) ? new Date(oaDetails.LastWeeklyManagementsPaymentDate) : null, // DateTime
        onAirSyncedAt: new Date(), // DateTime
        owner: {
            connect: {
                id: user.accountId,
            }
        }
    }

    let x = await CompanyRepo.upsertByGuid(oaDetails.Id, newCompany, {
        humanize: ['createdAt', 'updatedAt', 'onAirSyncedAt', 'lastConnection', 'lastReportDate', 'creationDate', 'pausedDate', 'lastWeeklyManagementsPaymentDate'],
        serialize: true,
    });

    

    return res.status(201).json(x)
}