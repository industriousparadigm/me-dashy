import { createAssetInDatabase } from "lib/api";
import { useState } from "react";

export default function TokenAdder({ userAssets }) {
  const [tokenId, setTokenId] = useState("");
  const [amount, setAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const onFormSubmit = async (event) => {
    event.preventDefault();

    const sanitizedData = {
      tokenId: tokenId.toUpperCase(),
      amount: parseFloat(amount),
    };

    // get out if user already has this token
    const isRepeatToken = userAssets.some(
      (asset) => asset.id === sanitizedData.tokenId
    );
    if (isRepeatToken) {
      setErrorMessage(`${tokenId} is already in dashboard`);
      return;
    }

    // add token to database and attach to current user
    const result = await createAssetInDatabase(sanitizedData);

    console.log({ result });

    // TODO: add token in React UI

    // clear form
    setAmount("");
    setTokenId("");
    setErrorMessage("");
  };

  return (
    <>
      <h2>Add a token here!</h2>
      <form className="flex-form" onSubmit={onFormSubmit}>
        <label htmlFor="tokenId">Token</label>
        <input
          onChange={(e) => setTokenId(e.target.value)}
          value={tokenId}
          type="text"
          name="token"
        />
        <label htmlFor="amount">Amount</label>
        <input
          onChange={(e) => setAmount(e.target.value)}
          value={amount}
          placeholder={"amount"}
          type="number"
          step="any"
          name="amount"
        />
        <button type="submit">Add</button>
        {errorMessage && <span style={{ color: "red" }}>{errorMessage}</span>}
      </form>
    </>
  );
}
