import bcrypt from "bcryptjs";
import passport from "passport";
import prisma from "../prisma/prismaClient.js";
import extractToken from "./extractToken.js";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as JwtStrategy } from "passport-jwt";

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: extractToken,
      secretOrKey: process.env.JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { id: payload.id },
        });
        if (!user) {
          return done(null, false, { message: "No token provided" });
        }
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    },
  ),
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { email },
        });
        if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
          return done(null, false, { message: "Incorrect email or password" });
        }
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    },
  ),
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (_accessToken, _refreshToken, profile, done) => {
      const { id, displayName, emails } = profile;
      const email = emails?.[0]?.value.toLowerCase() ?? "";

      try {
        let user = await prisma.user.findUnique({
          where: { email },
        });
        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              fullName: displayName,
              role: "CUSTOMER",
            },
          });
        }

        await prisma.oAuthAccount.upsert({
          where: {
            provider_providerId: {
              provider: "google",
              providerId: id,
            },
          },
          update: {},
          create: {
            provider: "google",
            providerId: id,
            userId: user.id,
          },
        });

        done(null, user);
      } catch (error) {
        return done(error, false);
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
    async (_accessToken, _refreshToken, profile, done) => {
      const { id, name, emails } = profile;
      const email = emails?.[0]?.value.toLowerCase() ?? "";

      try {
        let user = await prisma.user.findUnique({
          where: { email },
        });
        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              fullName: `${name.givenName} ${name.familyName}`,
              role: "CUSTOMER",
            },
          });
        }

        await prisma.oAuthAccount.upsert({
          where: {
            provider_providerId: {
              provider: "facebook",
              providerId: id,
            },
          },
          update: {},
          create: {
            provider: "facebook",
            providerId: id,
            userId: user.id,
          },
        });

        done(null, user);
      } catch (err) {
        done(err, false);
      }
    },
  ),
);

export default passport;
