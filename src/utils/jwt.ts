import type { JWT } from '@fastify/jwt'
import jwksRsa from 'jwks-rsa'

export const createJwksClient = (publicKeysUri: string) =>
  jwksRsa({
    jwksUri: publicKeysUri,
    cache: true,
    cacheMaxEntries: 5,
    cacheMaxAge: 10 * 60 * 1000, // 10 minutes
    rateLimit: true,
    jwksRequestsPerMinute: 10,
  })

export function generateJwtToken(jwt: JWT, payload: Record<string, unknown>): string {
  return jwt.sign(payload)
}
