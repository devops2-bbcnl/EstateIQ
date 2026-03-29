import { PrismaClient } from './src/generated/prisma'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * Railway / many cloud Postgres hosts require TLS when connecting from outside their network
 * (e.g. Netlify Functions). Append sslmode=require if not already present.
 */
function resolveDatabaseUrl(): string | undefined {
  const url = process.env.DATABASE_URL
  if (!url) return undefined
  if (/[?&]sslmode=/.test(url)) return url
  if (url.includes('rlwy.net') || url.includes('railway.app')) {
    const sep = url.includes('?') ? '&' : '?'
    return `${url}${sep}sslmode=require`
  }
  return url
}

function prismaClientOptions(): ConstructorParameters<typeof PrismaClient>[0] {
  const resolved = resolveDatabaseUrl()
  const base: ConstructorParameters<typeof PrismaClient>[0] = {
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  }
  // Never pass `url: undefined` — it overrides schema env("DATABASE_URL") and breaks the client.
  if (resolved) {
    base.datasources = { db: { url: resolved } }
  }
  return base
}

const prismaClient =
  globalForPrisma.prisma ?? new PrismaClient(prismaClientOptions())

// One client per serverless instance (warm container); same pattern as dev HMR.
globalForPrisma.prisma = prismaClient

export const prisma = prismaClient

export * from './src/generated/prisma'