import crypto from 'crypto';
import type { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'edupdf-super-secret-production-key-2026';

export interface TokenPayload {
  userId: string;
  phone: string;
  email?: string;
  name: string;
  role: string;
  exp: number;
}

export function createAuthToken(user: { _id?: any; id?: any; phone: string; email?: string; name: string; role?: string }): string {
  const userId = user._id ? user._id.toString() : user.id;
  const payload: TokenPayload = {
    userId,
    phone: user.phone,
    email: user.email,
    name: user.name,
    role: user.role || 'STUDENT',
    exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days validity
  };

  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');

  return `${header}.${body}.${signature}`;
}

export function verifyAuthToken(token: string): TokenPayload | null {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, body, signature] = parts;
    const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');

    if (signature !== expectedSig) {
      return null;
    }

    const payload: TokenPayload = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}

export function getAuthFromRequest(request: NextRequest): TokenPayload | null {
  // Check Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    const verified = verifyAuthToken(token);
    if (verified) return verified;
  }

  // Check Cookie
  const cookieToken = request.cookies.get('studyfreepdf_token')?.value;
  if (cookieToken) {
    const verified = verifyAuthToken(cookieToken);
    if (verified) return verified;
  }

  return null;
}
