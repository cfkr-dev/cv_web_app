import { NextRequest, NextResponse } from "next/server"

import {
  BLOCKED_ROUTE_NOTICE_COOKIE,
  DEV_BYPASS_QUERY_PARAM,
  protectedRouteAccessMap,
} from "@/lib/protected-route-access"

function getProtectedRouteEntry(pathname: string) {
  const routeEntries = Object.entries(protectedRouteAccessMap).sort(
    ([leftPath], [rightPath]) => rightPath.length - leftPath.length
  )

  return routeEntries.find(([protectedPath]) => {
    return pathname === protectedPath || pathname.startsWith(`${protectedPath}/`)
  })
}

function isDevelopmentApp() {
  return (
    process.env.NEXT_PUBLIC_APP_ENV === "development" ||
    process.env.NODE_ENV === "development"
  )
}

async function hasProtectedRouteAccess(request: NextRequest, pathname: string) {
  const protectedRouteEntry = getProtectedRouteEntry(pathname)
  const protectedRoute = protectedRouteEntry?.[1]

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
  const protectedRouteEntry = getProtectedRouteEntry(pathname)
  const protectedPath = protectedRouteEntry?.[0]
  const protectedRoute = protectedRouteEntry?.[1]

  if (!protectedRoute) {
    return NextResponse.next()
  }

  const hasAccess = await hasProtectedRouteAccess(request, pathname)

  if (hasAccess) {
    return NextResponse.next()
  }

  const redirectUrl = new URL(protectedRoute.fallbackPath, request.url)
  const response = NextResponse.redirect(redirectUrl)
  response.cookies.set(BLOCKED_ROUTE_NOTICE_COOKIE, encodeURIComponent(protectedPath ?? pathname), {
    path: "/",
    maxAge: 15,
    sameSite: "lax",
  })

  return response
}

export const config = {
  matcher: ["/complete-registration", "/profile/:path*", "/reset-password"],
}
