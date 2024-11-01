import prisma from "../../lib/prisma";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  try {
    // First, try to delete existing user
    try {
      await prisma.user.delete({
        where: {
          username: "mike",
        },
      });
      console.log("Existing user deleted");
    } catch (e) {
      console.log("No existing user to delete");
    }

    // Create new password hash
    const password = "12345";
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hash created:", hashedPassword);

    // Create new user
    const user = await prisma.user.create({
      data: {
        username: "mike",
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    // Verify the password
    const verifyPassword = await bcrypt.compare(password, user.password);

    return res.status(200).json({
      message: "Test user created",
      userId: user.id,
      username: user.username,
      passwordVerified: verifyPassword,
      passwordUsed: password,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      message: "Error creating test user",
      error: error.message,
    });
  }
}
