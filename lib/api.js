export const createAssetInDatabase = async (payload) =>
  await fetch("/api/add-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

export const deleteAssetFromDatabase = async (payload) =>
  await fetch("/api/delete-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
