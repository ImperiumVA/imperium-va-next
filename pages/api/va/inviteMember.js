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
    put: InviteMember,
});


async function InviteMember(req, res) {
    const { user } = await unstable_getServerSession(req, res, authOptions)
    if (!user) {
        return res.status(401).json({ message: "You must be logged in." });
    }

    const account = await AccountRepo.findById(user.accountId);
    
    if (!account) {
        return res.status(401).json({ message: "Account not found." });
    }

    if (!req.body) throw 'No body';

    const {
        vaId,
        companyId,
    } = JSON.parse(req.body);

    if (!vaId) throw 'VA ID is required'
    if (!companyId) throw 'Company ID is required'

    const va = await VirtualAirlineRepo.findById(vaId);
    if (!va) throw 'VA not found'

    const company = await CompanyRepo.findById(companyId, {
        include: {
            owner: true,
        },
    });

    if (!company) throw 'Company not found'

    const token = await TokenService.sign({
        vaId: va.id,
        companyId: company.id,
        accountId: account.id,
    });

    console.log('JWT::token', token);
    console.log('\n\n');
    
    try {
        let email = await EmailRepo.create({
            from: process.env.EMAIL_FROM,
            to: account.email,
            type: 'va-invite',
        });
    
        const newInvite = {
            isPending: true,
            token: token,
            va: {
                connect: {
                    id: va.id,
                }
            },
            company: {
                connect: {
                    id: company.id,
                },
            },
            account: {
                connect: {
                    id: account.id,
                }
            },
            email: {
                connect: {
                    id: email.id,
                }
            }
        };
    
        console.log('newInvite', newInvite);

        const invitation = await VAInviteRepo.create(newInvite);
    
        const sentEmail = await EmailService.sendTemplateEmail('va-invite', {
            to: company.owner.email,
            subject: `You have been invited to join ${va.name}`,
            from: process.env.EMAIL_FROM,
            data: {
                emailId: email.id,
                inviteId: invitation.id,
                vaName: va.name,
                companyName: company.name,
                ownerName: company.owner.username,
                vaId: va.id,
                companyId: company.id,
                inviteLink: `${process.env.NEXTAUTH_URL}/api/va/invite?inviteId=${invitation.id}&token=${invitation.token}`,
            },
        })

        email = await EmailRepo.update(email.id, {
            sentAt: sentEmail.sentAt,
            messageId: sentEmail.messageId,
            payload: JSON.stringify(sentEmail),
        });

        return res.status(201).json({email, invitation });
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ error: e, message: "Something went wrong." });
    }

}