import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "@/middleware/requireRole";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  requireRole(["admin"])(req, res, async () => {
    res.status(200).json({ message: "Welcome, Admin!" });
  });
}
