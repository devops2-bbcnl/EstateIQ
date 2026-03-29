import { NextResponse } from 'next/server'
import { prisma, Prisma } from '@estateiq/database'

export const dynamic = 'force-dynamic'

export async function GET() {
  const start = Date.now()

  try {
    // Static SQL avoids tagged-template edge cases in some serverless bundles.
    await prisma.$queryRawUnsafe('SELECT 1')
    const dbLatency = Date.now() - start

    return NextResponse.json({
      status:    'ok',
      timestamp: new Date().toISOString(),
      version:   process.env.npm_package_version ?? '1.0.0',
      uptime:    process.uptime(),
      database: {
        status:  'connected',
        latency: `${dbLatency}ms`,
      },
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    const prismaInit =
      err instanceof Prisma.PrismaClientInitializationError ? err : null
    return NextResponse.json(
      {
        status:    'degraded',
        timestamp: new Date().toISOString(),
        database: {
          status: 'disconnected',
          error:  message,
          ...(prismaInit?.errorCode && { prismaErrorCode: prismaInit.errorCode }),
        },
        ...(!process.env.DATABASE_URL && {
          hint: 'DATABASE_URL is not set for this serverless function. In Netlify: Site configuration → Environment variables → add DATABASE_URL and ensure scope includes Functions (or All), then redeploy.',
        }),
      },
      { status: 503 }
    )
  }
}