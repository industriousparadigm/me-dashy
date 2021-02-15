import Iron from "@hapi/iron";
import CookieService from "lib/cookie";
import prisma from "lib/prisma";

export default async (req, res) => {
  // get tokenId and amount from req
  const { tokenId, amount } = req.body;

  // get current user
  let currentUser;

  const authToken = CookieService.getAuthToken(req.cookies);

  if (!authToken) {
    return res.status(401).end();
  }

  try {
    currentUser = await Iron.unseal(
      authToken,
      process.env.ENCRYPTION_SECRET,
      Iron.defaults
    );
  } catch (error) {
    console.info("Failed to read user token from cookies.", error);
    return res.status(401).end();
  }

  // find user id in database (i hate this)
  try {
    const userFromDb = await prisma.user.findUnique({
      where: { email: currentUser.email },
    });
    currentUser.prismaId = userFromDb.id;
  } catch (error) {
    console.error(
      "Could not retrieve user id from database.",
      currentUser,
      error
    );
    return res.status(500).end();
  }

  // create a new asset belonging to that user
  let newAsset;

  // sanitize data for DB
  const data = {
    tokenId: tokenId.toUpperCase(),
    amount: parseFloat(amount),
    ownerId: currentUser.prismaId,
  };

  try {
    newAsset = await prisma.asset.create({ data });
  } catch (error) {
    console.info("Failed to write new asset to DB", error);
    return res.status(500).end();
  }

  res.json(newAsset);
};
