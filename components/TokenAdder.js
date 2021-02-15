import { createAssetInDatabase } from "lib/api";
import { useState } from "react";

export default function TokenAdder() {
  const [tokenId, setTokenId] = useState("");
  const [amount, setAmount] = useState(0);

  const onFormSubmit = (event) => {
    event.preventDefault();

    // add token to database and attach to current user
    createAssetInDatabase(tokenId, amount);

    setAmount(0);
    setTokenId("");
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
      </form>
    </>
  );
}
