import Iron from "@hapi/iron";
import CookieService from "lib/cookie";
import prisma from "lib/prisma";

export default async (req, res) => {
  let user;

  const authToken = CookieService.getAuthToken(req.cookies);

  if (!authToken) {
    res.status(401);
    return res.json(user);
  }

  try {
    user = await Iron.unseal(
      CookieService.getAuthToken(req.cookies),
      process.env.ENCRYPTION_SECRET,
      Iron.defaults
    );
  } catch (error) {
    console.info("Failed to read user token from cookies.", error);
    res.json(user);
    return res.status(401).end();
  }

  // connect to prisma database
  if (user?.email) {
    try {
      let userFromDb = await prisma.user.findUnique({
        where: { email: user.email },
        include: {
          assets: true,
        },
      });

      // if user doesnt exist, create user
      if (!userFromDb) {
        userFromDb = await prisma.user.create({
          data: {
            email: user.email,
          },
        });
      }

      // add user info from DB to user object
      user.assets = userFromDb.assets || [];
      user.prismaId = userFromDb.id;
    } catch (error) {
      console.error("Error querying database.", error);
      res.json(user);
      return res.status(500).end();
    }
  }

  res.json(user);
};
