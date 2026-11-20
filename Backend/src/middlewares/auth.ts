import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../lib/auth";

export enum UserRole { SELLER = "SELLER", ADMIN = "ADMIN", CUSTOMER = "CUSTOMER" }

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string; name: string; role: string; emailVerified: boolean };
    }
  }
}

const requireEmailVerification = process.env.REQUIRE_EMAIL_VERIFICATION !== "false";

const auth = (...roles: UserRole[]) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await betterAuth.api.getSession({ headers: req.headers as any });
    if (!session) return res.status(401).json({ success: false, message: "Please sign in to continue." });
    if (requireEmailVerification && !session.user.emailVerified) {
      return res.status(403).json({ success: false, message: "Email verification is required before accessing this resource." });
    }

    req.user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role as string,
      emailVerified: session.user.emailVerified,
    };

    if (roles.length && !roles.includes(req.user.role as UserRole)) {
      return res.status(403).json({ success: false, message: "You do not have permission to access this resource." });
    }
    return next();
  } catch (error) {
    return next(error);
  }
};

export default auth;
