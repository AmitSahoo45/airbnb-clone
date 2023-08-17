import { PrismaClient } from "@prisma/client"

declare global { // -> global definition of prisma, so it can work throughout the app
    var prisma: PrismaClient | undefined
}

const client = globalThis.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") globalThis.prisma = client

export default client

// reason for this?
// Next.js 13 while hot reloading can cause a bunch of new instances of prisma to be created giving a warning in terminal. There is a fix for this in the works but for now this is a workaround.
// CLEANER SOLUTION & best practice