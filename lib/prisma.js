import { PrismaClient } from "@prisma/client"

/**
 * Hack from https://github.com/prisma/prisma/issues/1983#issuecomment-620621213
 * to avoid too many prisma clients being instantiated during development
 */
let prisma

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }

  prisma = global.prisma
}

export default prisma
