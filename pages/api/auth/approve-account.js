import { authOptions } from 'pages/api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"
import { apiHandler, omit, slugify } from 'helpers/api'
import AccountRepo from 'repos/AccountRepo'

export default apiHandler({
    get: AcceptInvite,
});

async function AcceptInvite(req, res) {
    const {
        accountId,
    } = req.query;

    if (!accountId) return res.status(400).json({ message: 'Account ID is required' });
    console.log('accountId', accountId);

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
        return res.status(401).json({ message: "Account not found." });
    }

    if (approvingAccount.isAdmin !== true) {
        return res.status(401).json({ message: "You must be an Administrator." });
    }
    
    const account = await AccountRepo.update(accountId, {
        isEnabled: true,
    });

    return res.redirect('/account-enabled');
}
