import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const requireEmailVerification = process.env.REQUIRE_EMAIL_VERIFICATION !== "false";
const googleOAuthConfigured = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || process.env.APP_URL,
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  trustedOrigins: [process.env.APP_URL!],
  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "CUSTOMER", required: false },
      phone: { type: "string", required: false },
      status: { type: "string", defaultValue: "ACTIVE", required: false },
    },
  },
  emailAndPassword: { enabled: true, requireEmailVerification },
  ...(requireEmailVerification ? {
    emailVerification: {
      sendOnSignIn: true,
      autoSignInAfterVerification: true,
      sendVerificationEmail: async ({ user, url, token }: any) => {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
        await transporter.sendMail({
          from: `"MediStore" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: "Verify your MediStore email",
          html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:32px auto;padding:28px;color:#1f2937"><h1 style="color:#16834a">Welcome to MediStore</h1><p>Hello ${user.name || user.email},</p><p>Please verify your email address to finish creating your account.</p><p><a href="${verificationUrl}" style="display:inline-block;padding:12px 20px;background:#16834a;color:#fff;border-radius:8px;text-decoration:none">Verify email</a></p><p>Fallback link: <a href="${url}">verify your email</a>.</p><p>MediStore Support</p></div>`,
        });
      },
    },
  } : {}),
  ...(googleOAuthConfigured ? {
    socialProviders: {
      google: { prompt: "select_account consent", accessType: "offline", clientId: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_CLIENT_SECRET! },
    },
  } : {}),
});
