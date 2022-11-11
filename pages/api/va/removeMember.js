import { apiHandler, omit, slugify } from 'helpers/api'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"
import VAInviteRepo from 'repos/VAInviteRepo'
import EmailRepo from 'repos/EmailRepo'
import VirtualAirlineRepo from 'repos/VirtualAirlineRepo'
import CompanyRepo from 'repos/CompanyRepo'
import AccountRepo from 'repos/AccountRepo'
import EmailService from 'services/EmailService'
import TokenService from 'services/TokenService'

export default apiHandler({
    put: RemoveMember,
});


async function RemoveMember(req, res) {
    const { user } = await unstable_getServerSession(req, res, authOptions)
    if (!user) {
        return res.status(401).json({ message: "You must be logged in." });
    }

    const account = await AccountRepo.findById(user.accountId);
    
    if (!account) {
        return res.status(401).json({ message: "Account not found." });
    }

    if (!req.body) return res.status(400).json({ message: 'No body' });

    const {
        vaId,
        memberId,
    } = JSON.parse(req.body);

    if (!vaId) return res.status(400).json({ message: 'VA ID is required' })
    if (!memberId) return res.status(400).json({ message: 'Member ID is required' })

    let va = await VirtualAirlineRepo.findById(vaId);
    if (!va) return res.status(404).json({ message: 'VA not found' })

    if (va.ownerId !== account.id) return res.status(403).json({ message: 'You are not the owner of this VA'})

    let company = await CompanyRepo.findById(memberId, {
        include: {
            owner: true,
        },
    });

    if (!company) return res.status(404).json({ message: 'Company not found' })

    company = await CompanyRepo.update(company.id, {
        virtualAirlineId: null,
    });

    return res.status(200).json({ message: "Member removed." });
}