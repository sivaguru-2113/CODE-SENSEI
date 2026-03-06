import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                name: { label: "Name", type: "text" }
            },
            async authorize(credentials) {
                // This is a basic mock authorize function. 
                // In a real app, you would verify against a database here.
                if (credentials?.email) {
                    return {
                        id: "user_123",
                        name: credentials.name || "Sensei User",
                        email: credentials.email,
                        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${credentials.name || credentials.email}`,
                    }
                }
                return null
            }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.sub
            }
            return session
        },
    },
    pages: {
        signIn: '/login',
    },
    secret: process.env.NEXTAUTH_SECRET || "super-secret-cs-key-123",
})

export { handler as GET, handler as POST }
