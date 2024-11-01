import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  try {
    // Test database connection
    const testUser = await prisma.user.findUnique({
      where: {
        username: "mike",
      },
      select: {
        id: true,
        username: true,
        role: true,
        // Don't select password for security
      },
    });

    if (testUser) {
      return res.status(200).json({
        message: "Database connection successful",
        user: testUser,
        timestamp: new Date().toISOString(),
      });
    } else {
      return res.status(404).json({
        message: "User not found but database connection successful",
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("Database test error:", error);
    return res.status(500).json({
      message: "Database connection failed",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}
