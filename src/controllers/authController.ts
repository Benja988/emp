import { NextApiRequest, NextApiResponse } from "next";
import User from "@/models/User";
import { hashPassword, verifyPassword, generateJWT } from "@/services/authService";
import { dbConnect } from "@/lib/db";

export async function registerUser(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    await dbConnect();
    const { name, email, password, role } = req.body;

    if (await User.findOne({ email })) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({ name, email, password: hashedPassword, role });

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function loginUser(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    await dbConnect();
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await verifyPassword(password, user.password)))
      return res.status(401).json({ error: "Invalid credentials" });

    const token = generateJWT(user);
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
