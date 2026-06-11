import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET ?? 'default_secret';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/(auth)/signin', request.url));
  }

  try {
    verify(token, JWT_SECRET);
    return NextResponse.next();
  } catch {
    const signInUrl = new URL('/(auth)/signin', request.url);
    return NextResponse.redirect(signInUrl);
  }
}

export const config = {
  matcher: ['/mypage', '/product/:path*', '/compare', '/user/:path*'],
};
