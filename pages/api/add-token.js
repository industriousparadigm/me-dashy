import prisma from "lib/prisma"

export default async (req, res) => {
  const { tokenId, amount, isFiat, isStable, ownerId } = req.body

  if (!tokenId || !amount || !ownerId) throw new Error("Missing data")

  // sanitize data for DB just in case
  const data = {
    tokenId: tokenId.toUpperCase(),
    amount: parseFloat(amount),
    ownerId: parseInt(ownerId, 10),
    isFiat: !!isFiat,
    isStable: !!isStable,
  }

  // create a new asset belonging to that user
  try {
    const newAsset = await prisma.asset.create({ data })
    res.json(newAsset)
  } catch (error) {
    console.error("Failed to write new asset to DB", error)
    return res.status(500).end()
  }
}
