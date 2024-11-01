import prisma from "../../lib/prisma";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: "mike",
      },
    });

    // Test password '12345'
    const isValid = await bcrypt.compare("12345", user.password);

    return res.status(200).json({
      passwordValid: isValid,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Password test error:", error);
    return res.status(500).json({
      message: "Password test failed",
      error: error.message,
    });
  }
}
