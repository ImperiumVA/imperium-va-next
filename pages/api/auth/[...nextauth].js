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
            const Account = await AccountRepo.findByDiscordId(user.id);

            if (Account) {
                if (Account.isEnabled) {
                    user.account = Account;
                    return true;
                } else {
                    return '/account-disabled';
                }
            } else {
                user.account = await AccountRepo.create({
                    discordId: profile.id,
                    username: profile.username,
                    discriminator: profile.discriminator,
                    email: profile.email,
                    locale: profile.locale,
                    verified: profile.verified,
                    isAdmin: false,
                    isEnabled: false
                });

                user.image_url = profile.image_url;


                return false;
            }
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;

            // session.account = user.account;
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