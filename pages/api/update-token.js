import prisma from "lib/prisma";

export default async (req, res) => {
  // get tokenId and user from req
  const { id, amount } = req.body;

  // sanitize data and build prisma query
  const prismaQuery = {
    where: {
      id,
    },
    data: { amount: parseFloat(amount) },
  };

  // update the amount for that token/user
  try {
    const result = await prisma.asset.update(prismaQuery);
    res.json(result);
  } catch (error) {
    console.info(
      "Failed to update asset in DB",
      { assetId: id, amount },
      error
    );
    return res.status(500).end();
  }
};
