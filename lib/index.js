/* eslint-disable no-useless-escape */
export const slugify = (str) =>
  str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[\s\W-]+/g, "-") // Replace spaces, non-word characters and dashes with a single dash (-)
    .replace(/-$/, "") // Remove last floating dash if exists

export const getLogoUrl = (tokenName) => {
  if (tokenName === "Dai")
    return "https://cryptologos.cc/logos/thumbs/multi-collateral-dai.png?v=010"
  if (tokenName === "Polkadot")
    return "https://cryptologos.cc/logos/thumbs/polkadot-new.png?v=010"

  return `https://cryptologos.cc/logos/thumbs/${slugify(tokenName)}.png?v=010`
}

export const addCommasToNumber = (number) =>
  number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

export const beautifyNumber = (number, decimals = 2) => {
  // parseFloat twice to remove trailing zeros after comma
  const withTwoDecimals = parseFloat(parseFloat(number).toFixed(decimals))
  // add commas to 1000+ numbers
  const withCommas = addCommasToNumber(withTwoDecimals)
  return withCommas
}

export const getTokens = async (tokenIdsStr) => {
  const idsString = tokenIdsStr ? "&ids=" + tokenIdsStr : ""
  const url = `https://api.nomics.com/v1/currencies/ticker?key=${process.env.API_KEY}${idsString}`
  const res = await fetch(url)
  return await res.json()
}

export const buildCriptoAsset = (asset, tokens) => {
  const token = tokens.find((token) => token.id === asset.tokenId)

  if (!token) return null

  return {
    ...token,
    amountHeld: asset.amount,
    usdValueHeld: asset.amount * token.price,
  }
}

export const buildUsdAsset = (asset) => ({
  id: "USD",
  name: "US Dollar",
  price: 1,
  amountHeld: asset.amount,
  usdValueHeld: asset.amount,
})

export const buildUserAssets = (user, tokens) => {
  if (!user?.assets || !Array.isArray(tokens)) return []

  const criptoAssets = []
  const stableCoinAssets = []
  const fiatAssets = []

  user.assets.forEach((asset) => {
    // skip tokens not supported
    if (!checkTokenSupported(asset.tokenId)) return

    // TODO: make this work with non USD fiats
    if (asset.isFiat) return fiatAssets.push(buildUsdAsset(asset))

    const builtAsset = buildCriptoAsset(asset, tokens)

    asset.isStable
      ? stableCoinAssets.push(builtAsset)
      : criptoAssets.push(builtAsset)
  })

  // sort assets by USD value descending
  criptoAssets.sort((a, b) => b.usdValueHeld - a.usdValueHeld)
  stableCoinAssets.sort((a, b) => b.usdValueHeld - a.usdValueHeld)
  fiatAssets.sort((a, b) => b.usdValueHeld - a.usdValueHeld)

  return [...criptoAssets, ...stableCoinAssets, ...fiatAssets]
}

export const getUserUsdTotal = (userAssets) =>
  userAssets.reduce(
    (total, asset) => total + parseFloat(asset.usdValueHeld),
    0
  ) || 0

export const checkTokenSupported = (tokenId) => {
  const supportedTokensAndFiats = process.env.NEXT_PUBLIC_TOKENS_SUPPORTED.split(
    ","
  )
    .concat(process.env.NEXT_PUBLIC_STABLECOINS_SUPPORTED.split(","))
    .concat(process.env.NEXT_PUBLIC_FIAT_SUPPORTED.split(","))
  return supportedTokensAndFiats.includes(tokenId.toUpperCase())
}

export const isFiat = (tokenId) =>
  process.env.NEXT_PUBLIC_FIAT_SUPPORTED.split(",").includes(
    tokenId.toUpperCase()
  )

export const isStablecoin = (tokenId) =>
  process.env.NEXT_PUBLIC_STABLECOINS_SUPPORTED.split(",").includes(
    tokenId.toUpperCase()
  )

export const getSupportedCriptoCodes = (excludeStables) =>
  `${process.env.NEXT_PUBLIC_TOKENS_SUPPORTED}${
    excludeStables ? "" : "," + process.env.NEXT_PUBLIC_STABLECOINS_SUPPORTED
  }`

export const badInputsCheck = (userAssets, { tokenId, amount }) => {
  const isRepeatToken = userAssets.some((asset) => asset.id === tokenId)
  if (isRepeatToken) return `${tokenId} is already in dashboard`

  const isNotSupported = !checkTokenSupported(tokenId)
  if (isNotSupported) return `${tokenId} is not supported`

  const isWrongAmount = parseFloat(amount) <= 0
  if (isWrongAmount) return `Cannot have a negative amount`

  return ""
}
