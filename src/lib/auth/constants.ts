/**
 * Auth constants with NO database imports — safe to import from Edge middleware.
 *
 * The session cookie MUST be named `__session`: Firebase App Hosting's CDN
 * strips every other cookie name from requests, so any other name "works"
 * locally but silently breaks in production.
 */
export const SESSION_COOKIE = "__session";
