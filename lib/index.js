export const addCommas = (number) =>
  number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const beautifyNumber = (number) => {
  const withTwoDecimals = parseFloat(number).toFixed(2);
  const withCommas = addCommas(withTwoDecimals);
  return withCommas;
};

export const getTokens = async (userAssets) => {
  const idsString = userAssets ? "&ids=" + userAssets.join(",") : "";
  const url = `https://api.nomics.com/v1/currencies/ticker?key=${process.env.API_KEY}${idsString}`;
  const res = await fetch(url);
  return await res.json();
};

const buildCriptoAsset = (asset, tokens) => {
  const token = tokens.find((token) => token.id === asset.tokenId);

  if (!token) return null;

  return {
    ...token,
    amountHeld: asset.amount,
    usdValueHeld: asset.amount * token.price,
  };
};

const buildUsdAsset = (asset) => ({
  id: "USD",
  name: "US Dollar",
  price: 1,
  amountHeld: asset.amount,
  usdValueHeld: asset.amount,
});

export const buildUserAssets = (user, tokens) => {
  if (!user?.assets || !Array.isArray(tokens)) return [];

  const criptoAssets = [];
  const stableCoinAssets = [];
  const fiatAssets = [];

  user.assets.forEach((asset) => {
    // TODO: make this work with non USD fiats
    if (asset.isFiat) return fiatAssets.push(buildUsdAsset(asset));

    const builtAsset = buildCriptoAsset(asset, tokens);

    asset.isStable
      ? stableCoinAssets.push(builtAsset)
      : criptoAssets.push(builtAsset);
  });

  // sort assets by USD value descending
  criptoAssets.sort((a, b) => b.usdValueHeld - a.usdValueHeld);
  stableCoinAssets.sort((a, b) => b.usdValueHeld - a.usdValueHeld);
  fiatAssets.sort((a, b) => b.usdValueHeld - a.usdValueHeld);

  return [...criptoAssets, ...stableCoinAssets, ...fiatAssets];
};

export const getUserUsdTotal = (userAssets) =>
  userAssets.reduce(
    (total, asset) => total + parseFloat(asset.usdValueHeld),
    0
  ) || "$0";
