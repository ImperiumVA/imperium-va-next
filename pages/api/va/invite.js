import { authOptions } from 'pages/api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"
import { apiHandler, omit, slugify } from 'helpers/api'
import TokenService from 'services/TokenService'
import AccountRepo from 'repos/AccountRepo'
import CompanyRepo from 'repos/CompanyRepo'
import VAInviteRepo from 'repos/VAInviteRepo'

export default apiHandler({
    get: AcceptInvite,
});

async function AcceptInvite(req, res) {
    const {
        token,
        inviteId,
    } = req.query;

    if (!inviteId) return res.status(400).json({ message: 'Invite ID is required' });
    console.log('inviteId', inviteId);

    let invite = await VAInviteRepo.findPendingById(inviteId);
    console.log(invite);

    if (!invite) return res.status(400).json({ message: 'Invite not found' });

    if (!token) return res.status(400).json({ message: 'Token is required' });

    const {
        vaId,
        companyId,
        accountId,
    } = await TokenService.decode(token);

    const { user } = await unstable_getServerSession(req, res, authOptions)

    if (!user) {
        return res.status(401).json({ message: "You must be logged in." });
    }

    let account = await AccountRepo.findById(user.accountId);
    if (!account) {
        return res.status(401).json({ message: "Account not found." });
    }

    account = await AccountRepo.update(account.id, {
        virtualAirlines: {
            connect: {
                id: vaId,
            }
        }
    });

    let company = await CompanyRepo.findByOwnerId(account.id);
    if (!company) return res.status(400).json({ message: 'Company not found' });

    company = await CompanyRepo.update(company.id, {
        virtualAirline: {
            connect: {
                id: vaId,
            }
        }
    });


    invite = await VAInviteRepo.update(invite.id, {
        isPending: false,
        acceptedAt: new Date(),
    });

    return res.status(200).json({
        message: 'Invite accepted',
        company,
        invite,
        account,
    });
}
