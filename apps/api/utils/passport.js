import passport from "passport";
import prisma from "../prisma/prismaClient.js";
import bcrypt from "bcryptjs";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async ({ sub }, done) => {
      try {
        const user = await prisma.user.findUnique({ where: { id: sub } });
        if (!user) {
          return done(null, false, { message: "No token provided" });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

passport.use(
  new LocalStrategy({ usernameField: "email", passwordField: "password" }, async (email, password, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
        return done(null, false, { message: "Incorrect email or password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, { id: providerId, displayName: fullName, emails }, done) => {
      const email = emails?.[0]?.value.toLowerCase() ?? "";

      try {
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          user = await prisma.user.create({
            data: { email, fullName, role: "CUSTOMER" },
          });
        }

        await prisma.oAuthAccount.upsert({
          where: { provider_providerId: { provider: "google", providerId } },
          update: {},
          create: { provider: "google", providerId, userId: user.id },
        });

        done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "/auth/facebook/callback",
      profileFields: ["id", "emails", "name"],
    },
    async (accessToken, refreshToken, { id: providerId, name: { givenName, familyName }, emails }, done) => {
      const email = emails?.[0]?.value.toLowerCase() ?? "";
      const fullName = [givenName, familyName].join(" ");

      try {
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          user = await prisma.user.create({
            data: { email, fullName, role: "CUSTOMER" },
          });
        }

        await prisma.oAuthAccount.upsert({
          where: { provider_providerId: { provider: "facebook", providerId } },
          update: {},
          create: { provider: "facebook", providerId, userId: user.id },
        });

        done(null, user);
      } catch (err) {
        done(err);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export { passport };
