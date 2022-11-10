import { apiHandler, omit, slugify } from 'helpers/api'
import { VirtualAirlineRepo } from 'repos'
import { OnAirService } from 'helpers/onair'

export default apiHandler({
    post: Create,
});


async function Create(req, res) {
    if (!req.body) throw 'No body';

    const {
        vaId,
        apiKey,
    } = JSON.parse(req.body);

    console.log({
        vaId,
        apiKey
    })

    if (!vaId) throw 'VA ID is required'
    if (!apiKey) throw 'API Key is required'

    const oaDetails = await OnAirService.queryVADetails({ apiKey, vaId, })

    let x = await VirtualAirlineRepo.create({
        name: oaDetails.Name,
        airlineCode: oaDetails.AirlineCode,
        guid: oaDetails.Id,
        apiKey: apiKey,
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
    });

    return res.status(201).json(x);
}