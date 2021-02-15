import prisma from "lib/prisma";

export default async (req, res) => {
  // get tokenId and user from req
  const { id } = req.body;

  // sanitize data and build prisma query
  const prismaQuery = {
    where: {
      id,
    },
  };

  // delete the asset for that user
  try {
    const result = await prisma.asset.delete(prismaQuery);
    console.log({ result });
    res.json(result);
  } catch (error) {
    console.info("Failed to delete asset from DB", { assetId: id }, error);
    return res.status(500).end();
  }
};
