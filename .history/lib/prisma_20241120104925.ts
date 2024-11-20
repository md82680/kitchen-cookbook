import { PrismaClient } from '@prisma/client'

const prisma = global.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

prisma.$connect()
  .then(() => console.log('Database connected successfully'))
  .catch((error) => console.error('Database connection failed:', error))

export default prisma
