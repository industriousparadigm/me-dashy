import { serialize } from "cookie"

const TOKEN_NAME = "api_token"
const MAX_AGE = 60 * 60 * 24 * 30 // 30 days

function setCookie(name, data, options = {}) {
  return serialize(name, data, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    secure: process.env.NODE_ENV === "production",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    ...options,
  })
}

function deleteCookie(name) {
  return serialize(name, "", {
    maxAge: -1,
    expires: new Date(Date.now() - MAX_AGE * 1000),
    path: "/",
  })
}

function clearAuthCookies(res) {
  console.log("entering clear cookies")
  res.setHeader("Set-Cookie", [
    deleteCookie(TOKEN_NAME),
    deleteCookie("authed"),
  ])
}

function setTokenCookie(res, token) {
  res.setHeader("Set-Cookie", [
    setCookie(TOKEN_NAME, token),
    setCookie("authed", true, { httpOnly: false }),
  ])
}

function getAuthToken(cookies) {
  return cookies[TOKEN_NAME]
}

export default { setTokenCookie, getAuthToken, clearAuthCookies }
