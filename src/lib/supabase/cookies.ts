/** Shared cookie helpers — pure, safe to import in both edge middleware and server. */

export const REMEMBER_COOKIE = "d2d-remember"

/** Strip max-age/expires so an auth cookie lives only for the browser session. */
export function toSessionCookie<T extends { maxAge?: number; expires?: Date }>(options: T): T {
  const { maxAge: _m, expires: _e, ...rest } = options
  return rest as T
}
