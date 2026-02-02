import { PrismaClient } from "@prisma/client";
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaClient } from "@prisma/client";
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';

// Required for Neon serverless driver to work in non-edge environments (like local Node.js)
// Cloudflare Pages (Edge) has built-in WebSocket, so we skip this there.
if (!globalThis.WebSocket) {
    try {
        neonConfig.webSocketConstructor = require('ws');
    } catch (e) {
        console.warn("Could not import 'ws'. If running in Node.js, ensure 'ws' is installed.");
    }
}

const prismaClientSingleton = () => {
    const connectionString = process.env.POSTGRES_PRISMA_URL;
    const pool = new Pool({ connectionString });
    const adapter = new PrismaNeon(pool);
    return new PrismaClient({ adapter });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
