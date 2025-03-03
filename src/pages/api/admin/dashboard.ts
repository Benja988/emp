import { NextApiRequest, NextApiResponse } from "next";
import { requireRole } from "@/middleware/requireRole";
import { dbConnect } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect(); // Ensure DB is connected
  return requireRole(["admin"])(req, res, async () => {
    res.status(200).json({ message: "Welcome, Admin!" });
  });
}
