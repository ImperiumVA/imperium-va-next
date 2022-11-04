import prisma from "db"
import NextAuth from "next-auth"
import DiscordProvider from "next-auth/providers/discord"

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
            // email: profile.email,
            name: profile.username,
            image: profile.image_url,
          }
        },  
    })
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {

      const discordAccount = await prisma.discordAccount.upsert({
        where: {
          discordId: profile.id,
        },
        update: {
            username: profile.username,
            email: profile.email,
            verified: profile.verified,
            locale: profile.locale,
            lastLogin: new Date(),
        },
        create: {
            discordId: profile.id,
            username: profile.username,
            discriminator: profile.discriminator,
            email: profile.email,
            verified: profile.verified,
            locale: profile.locale,
            lastLogin: new Date(),
        },
      });

      user.discordAccount = discordAccount;
      
      return true
    },

    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin

      if (account) {
        token.accessToken = account.access_token
      }

      return token
    },
    async session({ session, token, user }) {
        // Send properties to the client, like an access_token from a provider.
        session.accessToken = token.accessToken
        const discordId = token.sub

        const query = {
            where: {
                discordId: discordId,
            },
        }

        const discordAccount = await prisma.discordAccount.findUnique(query);
        
        if (!discordAccount) {
            return false;
        }

        
        session.user.isAdmin = discordAccount.isAdmin;
        session.user.accountId = discordAccount.id;
        
        return session
    }
  },
  pages: {
    signIn: '/auth/signin',
  }
}

export default NextAuth(authOptions)