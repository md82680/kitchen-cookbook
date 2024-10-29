import prisma from "../../lib/db";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  try {
    // Generate new password hash
    const hashedPassword = await bcrypt.hash("12345", 10);

    // Update user's password
    const updatedUser = await prisma.user.update({
      where: {
        username: "mike",
      },
      data: {
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        role: true,
      },
    });

    return res.status(200).json({
      message: "Password reset successful",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return res.status(500).json({
      message: "Password reset failed",
      error: error.message,
    });
  }
}
