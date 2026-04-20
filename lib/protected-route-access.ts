export const DEV_BYPASS_QUERY_PARAM = "dev-bypass"
export const BLOCKED_ROUTE_NOTICE_COOKIE = "mw-blocked-route-notice"

type ProtectedRouteConfig = {
  accessCookieName: string
  fallbackPath: string
}

export const protectedRouteAccessMap: Record<string, ProtectedRouteConfig> = {
  "/complete-registration": {
    accessCookieName: "mw-flow-complete-registration",
    fallbackPath: "/register",
  },
  "/profile": {
    accessCookieName: "mw-flow-profile",
    fallbackPath: "/login",
  },
  "/reset-password": {
    accessCookieName: "mw-flow-reset-password",
    fallbackPath: "/recover-access",
  },
}

function getProtectedRouteConfig(pathname: string) {
  const routeEntries = Object.entries(protectedRouteAccessMap).sort(
    ([leftPath], [rightPath]) => rightPath.length - leftPath.length
  )

  return routeEntries.find(([protectedPath]) => {
    return pathname === protectedPath || pathname.startsWith(`${protectedPath}/`)
  })
}

function buildCookieString(name: string, value: string, maxAgeSeconds: number) {
  return `${name}=${value}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax`
}

function readCookie(name: string) {
  if (typeof document === "undefined") {
    return null
  }

  const cookies = document.cookie ? document.cookie.split("; ") : []

  for (const cookie of cookies) {
    const [cookieName, ...valueParts] = cookie.split("=")

    if (cookieName === name) {
      return valueParts.join("=")
    }
  }

  return null
}

export function grantProtectedRouteAccess(pathname: keyof typeof protectedRouteAccessMap) {
  if (typeof document === "undefined") {
    return
  }

  const config = protectedRouteAccessMap[pathname]

  if (!config) {
    return
  }

  document.cookie = buildCookieString(config.accessCookieName, "granted", 60 * 30)
}

export function consumeBlockedRouteNotice(expectedBlockedPath: string) {
  const blockedPath = readCookie(BLOCKED_ROUTE_NOTICE_COOKIE)

  if (!blockedPath) {
    return false
  }

  document.cookie = buildCookieString(BLOCKED_ROUTE_NOTICE_COOKIE, "", 0)

  return blockedPath === encodeURIComponent(expectedBlockedPath)
}

export function buildProtectedRouteHref(pathname: string, allowDevBypass: boolean) {
  if (!allowDevBypass || !getProtectedRouteConfig(pathname)) {
    return pathname
  }

  return `${pathname}?${DEV_BYPASS_QUERY_PARAM}=1`
}
