import { NextAuthOptions } from "next-auth";
import { Session, TokenSet } from "next-auth";
import Spotify from "next-auth/providers/spotify";

async function refreshAccessToken(token: TokenSet) {
    try {
        const url = "https://accounts.spotify.com/api/token";
        const payload = {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: token.refreshToken,
                client_id: process.env.SPOTIFY_CLIENT_ID,
            } as any),
        };

        const response = await fetch(url, payload);

        const refreshedTokens = await response.json();

        if (!response.ok) {
            throw refreshedTokens;
        }

        return {
            ...token,
            accessToken: refreshedTokens.accessToken,
            accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
            refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
        };
    } catch (error) {
        console.log(error);

        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }
}

export const authOptions: NextAuthOptions = {
    // Secret for Next-auth, without this JWT encryption/decryption won't work
    secret: process.env.NEXTAUTH_SECRET,

    // Configure one or more authentication providers
    providers: [
        Spotify({
            clientId: process.env.SPOTIFY_CLIENT_ID as string,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
            authorization: {
                params: {
                    scope: "streaming user-read-email user-read-private user-read-playback-state user-modify-playback-state user-top-read",
                },
            },
        }),
    ],

    callbacks: {
        async jwt({ token, account, user } : { token: any, account: any, user: any }) {
            // Initial sign in
            if (account && user) {
                return {
                    accessToken: account.access_token,
                    accessTokenExpires: Date.now() + (account.expires_at ?? 60) * 1000,
                    refreshToken: account.refresh_token,
                    user: user,
                };
            }
            if (Date.now() < token.accessTokenExpires) {
                return token;
            }

            // Access token has expired, try to update it
            return refreshAccessToken(token);
        },
        async session({ session, user, token }: { session: Session, user: any, token: any }) {
            if (token) {
                session.accessToken = token.accessToken;
                session.refreshToken = token.refreshToken;
                session.error = token.error
                session.user = token.user
            }
            return session;
        },
    },
};
