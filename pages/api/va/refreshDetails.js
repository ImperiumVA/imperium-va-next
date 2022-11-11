import { apiHandler, omit } from 'helpers/api'
import { VirtualAirlineRepo, } from 'repos'
import { OnAirService } from 'helpers/onair'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"

export default apiHandler({
    put: RefreshOnAirDetails,
});

async function RefreshOnAirDetails(req, res) {
    const { user } = await unstable_getServerSession(req, res, authOptions)
    if (!user) {
        return res.status(401).json({ message: "You must be logged in." });
    }

    const {
        vaId,
    } = JSON.parse(req.body)
    
    if (!vaId) throw 'OnAir VA ID is required'

    const va = await VirtualAirlineRepo.findById(vaId, {
        include: {
            owner: true,
        },
    });
    if (!va) throw 'VA not found'

    if (va.ownerId !== user.accountId) {
        return res.status(401).json({ message: "You are not the owner of this VA." });
    }

    let oaDetails = await OnAirService.queryVADetails({
        apiKey: va.apiKey,
        vaId: va.guid,
    })

    if (!oaDetails) return res.status(400).json({ message: 'OnAir VA Details not found', });
    let x = await VirtualAirlineRepo.update(va.id, {
        name: oaDetails.Name,
        airlineCode: oaDetails.AirlineCode,
        initalOwnerEquity: oaDetails.InitalOwnerEquity,
        percentDividendsToDistribute: oaDetails.PercentDividendsToDistribute,
        lastDividendsDistribution: (oaDetails.LastDividendsDistribution) ? new Date(oaDetails.LastDividendsDistribution) : null,
        imageName: oaDetails.ImageName,
        forceAssignJobsToPilots: oaDetails.ForceAssignJobsToPilots,
        automaticallyAssignJobWhenTaken: oaDetails.AutomaticallyAssignJobWhenTaken,
        automaticallyAssignJobWhenLoaded: oaDetails.AutomaticallyAssignJobWhenLoaded,
        restrictEmployeesUsage: oaDetails.RestrictEmployeesUsage,
        restrictLoadingVAJobsIntoNonVAAircraft: oaDetails.RestrictLoadingVAJobsIntoNonVAAircraft,
        restrictLoadingNonVAJobsIntoVAAircraft: oaDetails.RestrictLoadingNonVAJobsIntoVAAircraft,
        memberCount: oaDetails.MemberCount,
        lastConnection: (oaDetails.LastConnection) ? new Date(oaDetails.LastConnection) : null,
        lastReportDate: (oaDetails.LastReportDate) ? new Date(oaDetails.LastReportDate) : null,
        reputation: oaDetails.Reputation,
        creationDate: (oaDetails.CreationDate) ? new Date(oaDetails.CreationDate) : null,
        difficultyLevel: oaDetails.DifficultyLevel,
        uTCOffsetinHours: oaDetails.UTCOffsetinHours,
        paused: oaDetails.Paused,
        level: oaDetails.Level,
        levelXP: oaDetails.LevelXP,
        transportEmployeeInstant: oaDetails.TransportEmployeeInstant,
        transportPlayerInstant: oaDetails.TransportPlayerInstant,
        forceTimeInSimulator: oaDetails.ForceTimeInSimulator,
        useSmallAirports: oaDetails.UseSmallAirports,
        useOnlyVanillaAirports: oaDetails.UseOnlyVanillaAirports,
        enableSkillTree: oaDetails.EnableSkillTree,
        checkrideLevel: oaDetails.CheckrideLevel,
        enableLandingPenalities: oaDetails.EnableLandingPenalities,
        enableEmployeesFlightDutyAndSleep: oaDetails.EnableEmployeesFlightDutyAndSleep,
        aircraftRentLevel: oaDetails.AircraftRentLevel,
        enableCargosAndChartersLoadingTime: oaDetails.EnableCargosAndChartersLoadingTime,
        inSurvival: oaDetails.InSurvival,
        payBonusFactor: oaDetails.PayBonusFactor,
        enableSimFailures: oaDetails.EnableSimFailures,
        disableSeatsConfigCheck: oaDetails.DisableSeatsConfigCheck,
        realisticSimProcedures: oaDetails.RealisticSimProcedures,
        travelTokens: oaDetails.TravelTokens,
        onAirSyncedAt: new Date(),
    });

    return res.status(200).json(x)
}