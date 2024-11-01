import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prismaConfig = {
  datasources: {
    db: {
      url: process.env.POSTGRES_PRISMA_URL + "?sslmode=require&pool_timeout=0"
    }
  }
};

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient(prismaConfig);
  prisma.$connect()
    .then(() => console.log('Successfully connected to database'))
    .catch((e) => console.error('Failed to connect to database:', e));
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient(prismaConfig);
  }
  prisma = global.prisma;
}

export default prisma;
