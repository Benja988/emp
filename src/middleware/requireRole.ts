import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export function requireRole(roles: string[]) {
  return async (req: NextApiRequest, res: NextApiResponse, next: Function) => {
    const session = await getSession({ req });

    if (!session || !session.user || !("role" in session.user)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!roles.includes(session.user.role as string)) {
      return res.status(403).json({ error: "Access denied" });
    }

    return next();
  };
}
