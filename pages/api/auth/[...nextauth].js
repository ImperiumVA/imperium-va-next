import prisma from "db"
import NextAuth from "next-auth"
import DiscordProvider from "next-auth/providers/discord"
import AccountRepo from "repos/AccountRepo"

export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
            authorization: { params: { scope: 'identify email guilds' } },
            token: "https://discord.com/api/oauth2/token",
            userinfo: "https://discord.com/api/users/@me", 
            async profile(profile) {
        
                if (profile.avatar === null) {
                    const defaultAvatarNumber = parseInt(profile.discriminator) % 5
                    profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`
                } else {
                    const format = profile.avatar.startsWith("a_") ? "gif" : "png"
                    profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`
                }

                return {
                    id: profile.id,
                    email: profile.email,
                    name: profile.username,
                    image: profile.image_url,
                }
            },  
        })
    ],
    callbacks: {
        async signIn({user, account, profile }) {
            let Account = await AccountRepo.findByDiscordId(user.id);

            if (Account) {
                if (Account.isEnabled) {
                    user.account = Account;
                    user.accountId = Account.id;
                    user.isAdmin = Account.isAdmin;
                    user.image_url = profile.image_url;

                    return true;
                } else {
                    return '/account-disabled';
                }
            } else {
                Account = await AccountRepo.create({
                    discordId: profile.id,
                    username: profile.username,
                    discriminator: profile.discriminator,
                    email: profile.email,
                    locale: profile.locale,
                    verified: profile.verified,
                    isAdmin: false,
                    isEnabled: false
                });
            }

            return false;
        
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            session.user.id = token.sub;

            const Account = await AccountRepo.findByDiscordId(session.user.id);
            console.log('Session() Account:', Account);

            if (Account) {
                session.user.accountId = Account.id;
                session.user.isAdmin = Account.isAdmin;
            }

            console.log('Session() session:', session);
            return session;
        },
        async jwt({ token, account }) {
            // Persist the OAuth access_token to the token right after signin
            if (account) {
                token.accessToken = account.access_token
            }
    
            return token
        },
        async redirect({ url, baseUrl }) {
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url
            return baseUrl
          }
    },
    pages: {
        signIn: '/auth/signin',
    }
}

export default NextAuth(authOptions)