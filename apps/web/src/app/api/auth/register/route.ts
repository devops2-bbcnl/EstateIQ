import { NextResponse } from 'next/server'
import { prisma, Prisma, isDatabaseUrlConfigured } from '@estateiq/database'
import bcrypt from 'bcryptjs'
import { logger } from '@/lib/logger'
import { rateLimit } from '@/lib/rateLimit'
import { getPasswordPolicyErrorMessage, passwordMeetsPolicy } from '@/lib/passwordPolicy'

export const runtime = 'nodejs'

export async function POST(req: Request) {

  const limited = rateLimit(req as any, { limit: 5, windowMs: 60 * 1000 })
  if (limited) return limited

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  try {
    const { name, email, password, consent, plan } = body as {
      name?: string
      email?: string
      password?: string
      consent?: boolean
      plan?: string
    }

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    if (!consent) {
      return NextResponse.json(
        { error: 'You must agree to the Terms of Service and Privacy Policy' },
        { status: 400 }
      )
    }

    if (!passwordMeetsPolicy(password)) {
      return NextResponse.json({ error: getPasswordPolicyErrorMessage() }, { status: 400 })
    }

    const existing = await prisma.authUser.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.authUser.create({
      data: {
        name,
        email,
        passwordHash,
        consentGiven:   true,
        consentGivenAt: new Date(),
      },
    })

    return NextResponse.json({ id: user.id, email: user.email, plan: plan ?? 'STARTER' }, { status: 201 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    const stack = err instanceof Error ? err.stack : undefined
    const prismaMeta =
      err instanceof Prisma.PrismaClientKnownRequestError
        ? { prismaCode: err.code, prismaMeta: err.meta }
        : {}
    const initErr =
      err instanceof Prisma.PrismaClientInitializationError ? err : null
    logger.error('[POST /api/auth/register]', {
      message,
      stack,
      ...prismaMeta,
      ...(initErr && { prismaInitCode: initErr.errorCode }),
    })

    const dbUnreachable =
      Boolean(initErr) ||
      (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P1001') ||
      /Can't reach database server/i.test(message)

    if (dbUnreachable) {
      const urlReadable = isDatabaseUrlConfigured()
      const prismaStillUsingLocalhost = /localhost:5432|127\.0\.0\.1:5432/.test(message)

      if (!urlReadable || prismaStillUsingLocalhost) {
        return NextResponse.json(
          {
            error:
              'Database URL is missing or not visible to the server. In Netlify: Environment variables → DATABASE_URL = your Railway Postgres URL, scope Builds + Functions, redeploy.',
            code: 'DATABASE_URL_MISSING',
          },
          { status: 503 }
        )
      }

      return NextResponse.json(
        {
          error:
            'Could not reach your Postgres host. DATABASE_URL is set; check Railway service is running, the connection string and password are correct, and the database allows connections from the internet (SSL).',
          code: 'DATABASE_CONNECTION_FAILED',
        },
        { status: 503 }
      )
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}