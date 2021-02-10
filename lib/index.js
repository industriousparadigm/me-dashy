export const addCommas = (number) =>
  number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const beautifyNumber = (number) => {
  const withTwoDecimals = parseFloat(number).toFixed(2);
  const withCommas = addCommas(withTwoDecimals);
  return withCommas;
};

export const getTokens = async (userAssets) => {
  const idsString = Object.keys(userAssets).join(",");
  const url = `https://api.nomics.com/v1/currencies/ticker?key=${process.env.API_KEY}&ids=${idsString}`;
  console.log(idsString);
  const res = await fetch(url);
  return await res.json();
};
