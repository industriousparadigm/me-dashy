import prisma from "lib/prisma";

export default async (req, res) => {
  // get tokenId and amount from req
  const { tokenId, amount, isFiat, ownerId } = req.body;

  console.log({ ...req.body });

  // sanitize data for DB
  const data = {
    tokenId: tokenId.toUpperCase(),
    amount: parseFloat(amount),
    ownerId: parseInt(ownerId, 10),
    isFiat: !!isFiat,
  };

  // create a new asset belonging to that user
  let newAsset;
  try {
    newAsset = await prisma.asset.create({ data });
  } catch (error) {
    console.info("Failed to write new asset to DB", error);
    return res.status(500).end();
  }

  res.json(newAsset);
};
