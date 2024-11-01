import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.POSTGRES_PRISMA_URL + "?sslmode=require",
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    connection: {
      timeout: 20000 // 20 seconds
    }
  });
};

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = prismaClientSingleton();
} else {
  if (!global.prisma) {
    global.prisma = prismaClientSingleton();
  }
  prisma = global.prisma;
}

const connectWithRetry = async (retries = 3) => {
  while (retries > 0) {
    try {
      await prisma.$connect();
      console.log('Successfully connected to database');
      return;
    } catch (error) {
      retries--;
      if (retries === 0) {
        console.error('Failed to connect to database after all retries:', error);
        console.error('Database URL:', process.env.POSTGRES_PRISMA_URL ? 'URL is set' : 'URL is missing');
        console.error('Environment:', process.env.NODE_ENV);
        process.exit(1);
      }
      console.log(`Connection failed, retrying... (${retries} attempts remaining)`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
};

connectWithRetry()
  .catch((e) => {
    console.error('Connection initialization failed:', e);
    process.exit(1);
  });

process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;
