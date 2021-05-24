export const createAssetInDatabase = async (payload) =>
  await fetch("/api/add-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then((res) => res.json())

export const deleteAssetFromDatabase = async (payload) =>
  await fetch("/api/delete-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then((res) => res.json())

export const editAssetAmountInDatabase = async (payload) =>
  await fetch("/api/update-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then((res) => res.json())
