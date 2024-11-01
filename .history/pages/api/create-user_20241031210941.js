import prisma from "../../lib/prisma";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const hashedPassword = await bcrypt.hash("12345", 10);

    const user = await prisma.user.create({
      data: {
        username: "mike",
        password: hashedPassword,
        role: "ADMIN", // or 'USER' based on your needs
      },
    });

    res.status(201).json({ message: "User created", userId: user.id });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: error.message });
  }
}
