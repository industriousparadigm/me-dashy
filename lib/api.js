export const createAssetInDatabase = async (tokenId, amount) => {
  // post req to add-token api with payload
  const body = JSON.stringify({ tokenId, amount });

  return await fetch("/api/add-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
};
