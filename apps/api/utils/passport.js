import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import FacebookStrategy from 'passport-facebook';
import prisma from '../prisma/prismaClient';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
},
    async function (accessToken, refreshToken, profile, done) {
        const { id: providerId, displayName, emails } = profile;
        const email = emails[0].value;

        try {
            let oauthAccount = await prisma.oAuthAccount.findUnique({
                where: {
                    provider_providerId: {
                        provider: 'google',
                        providerId
                    }
                },
                include: { user: true }
            });

            if (oauthAccount) {
                return done(null, oauthAccount.user);
            }

            let user = await prisma.user.findUnique({ where: { email } });

            if (!user) {
                // Nếu chưa có user, tạo mới
                user = await prisma.user.create({
                    data: {
                        fullName: displayName,
                        email,
                        password: '', // vì là social login nên không cần password
                        role: 'CUSTOMER',
                        oauths: {
                            create: {
                                provider: 'google',
                                providerId
                            }
                        }
                    }
                });
            } else {
                // Đã có user, nhưng chưa liên kết với Google
                await prisma.oAuthAccount.create({
                    data: {
                        provider: 'google',
                        providerId,
                        userId: user.id
                    }
                });
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

// Serialize / Deserialize (cho session, hoặc có thể bỏ nếu dùng JWT)
passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
});

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'emails', 'name']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value;
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    fullName: `${profile.name.givenName} ${profile.name.familyName}`,
                    role: "CUSTOMER",
                    password: "" // hoặc null nếu không dùng
                }
            });
        }

        // tạo oauth account (nếu bạn dùng bảng OAuthAccount)
        await prisma.oAuthAccount.upsert({
            where: {
                provider_providerId: {
                    provider: 'facebook',
                    providerId: profile.id
                }
            },
            update: {},
            create: {
                provider: 'facebook',
                providerId: profile.id,
                userId: user.id
            }
        });

        done(null, user);
    } catch (err) {
        done(err, null);
    }
}));

export default passport;
