import { NextRequest, NextResponse } from "next/server"

import {
  BLOCKED_ROUTE_NOTICE_COOKIE,
  DEV_BYPASS_QUERY_PARAM,
  protectedRouteAccessMap,
} from "@/lib/protected-route-access"

function isDevelopmentApp() {
  return (
    process.env.NEXT_PUBLIC_APP_ENV === "development" ||
    process.env.NODE_ENV === "development"
  )
}

async function hasProtectedRouteAccess(request: NextRequest, pathname: string) {
  const protectedRoute = protectedRouteAccessMap[pathname]

  if (!protectedRoute) {
    return true
  }

  if (
    isDevelopmentApp() &&
    request.nextUrl.searchParams.get(DEV_BYPASS_QUERY_PARAM) === "1"
  ) {
    return true
  }

  // Punto de sustitucion para la validacion real con backend cuando exista el flujo.
  return request.cookies.get(protectedRoute.accessCookieName)?.value === "granted"
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const protectedRoute = protectedRouteAccessMap[pathname]

  if (!protectedRoute) {
    return NextResponse.next()
  }

  const hasAccess = await hasProtectedRouteAccess(request, pathname)

  if (hasAccess) {
    return NextResponse.next()
  }

  const redirectUrl = new URL(protectedRoute.fallbackPath, request.url)
  const response = NextResponse.redirect(redirectUrl)
  response.cookies.set(BLOCKED_ROUTE_NOTICE_COOKIE, encodeURIComponent(pathname), {
    path: "/",
    maxAge: 15,
    sameSite: "lax",
  })

  return response
}

export const config = {
  matcher: ["/complete-registration", "/reset-password"],
}
