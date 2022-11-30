import { authOptions } from 'pages/api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"
import { apiHandler, omit, slugify } from 'helpers/api'
import AccountRepo from 'repos/AccountRepo'
import { TokenService, } from "services/TokenService"

export default apiHandler({
    get: AcceptInvite,
});

async function AcceptInvite(req, res) {
    const session = await unstable_getServerSession(req, res, authOptions)

    if (!session) {
        return res.redirect('/auth/signin');
        // return res.status(401).json({ message: "You must be logged in." });
    }

    const { 
        user
    } = session

    let approvingAccount = await AccountRepo.findById(user.accountId);

    if (!approvingAccount) {
        return res.status(401).json({ message: "Approving account not found." });
    }

    if (approvingAccount.isAdmin !== true) {
        return res.status(401).json({ message: "You must be an Administrator to approve accounts." });
    }

    const {
        token,
    } = req.query;

    if (!token) return res.status(400).json({ message: 'Approval token is required' });

    const {
        username,
        discriminator,
        discordId,
    } = await TokenService.decode(token);
    
    await AccountRepo.enableAccount(discordId)

    return res.redirect('/account-enabled');
}
