import prisma from "../lib/db";
import bcrypt from "bcryptjs";

export async function createUser(username, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: {
      username,
      password: hashedPassword,
    },
  });
}

export async function validateUser(username, password) {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return { id: user.id, username: user.username };
}
