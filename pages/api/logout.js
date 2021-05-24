import CookieService from "lib/cookie"

export default async (req, res) => {
  // clear the cookies
  CookieService.clearAuthCookies(res)

  res.end()
}
