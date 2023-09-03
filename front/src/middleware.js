import { NextResponse } from 'next/server'
 
export function middleware(request) {
  // Getting cookies from the request using the `RequestCookies` API
  let cookie = request.cookies.get('auth_service')

  if (!cookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
 
  const response = NextResponse.next();

  return response
}


export const config = {
    matcher: ['/', '/account/:path*'],
  }