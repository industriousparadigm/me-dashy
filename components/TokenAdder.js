import useAuth from "hooks/useAuth";
import { badInputsCheck, isFiat, isStablecoin } from "lib";
import { createAssetInDatabase } from "lib/api";
import { useState } from "react";

export default function TokenAdder({ userAssets, addAsset }) {
  const [tokenId, setTokenId] = useState("");
  const [amount, setAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { user } = useAuth();

  const onFormSubmit = async (event) => {
    event.preventDefault();

    // find user id
    const userPrismaId = user.prismaId;

    const sanitizedInputs = {
      tokenId: tokenId.toUpperCase(),
      amount: parseFloat(amount),
      isFiat: isFiat(tokenId),
      isStable: isStablecoin(tokenId),
      ownerId: userPrismaId,
    };

    // stop if inputs are bad
    const errorMessage = badInputsCheck(userAssets, sanitizedInputs);
    if (errorMessage) {
      setErrorMessage(errorMessage);
      return;
    }

    // add token to database and attach to current user
    const result = await createAssetInDatabase(sanitizedInputs);

    // add token in React UI
    if (result) addAsset(result.tokenId, result.amount);

    // clear form
    setAmount("");
    setTokenId("");
    setErrorMessage("");
  };

  return (
    <>
      <h2>Add a token here!</h2>
      <form className="flex-form" onSubmit={onFormSubmit}>
        <label htmlFor="tokenId">
          <input
            className="styled-input"
            onChange={(e) => setTokenId(e.target.value)}
            value={tokenId}
            placeholder={"token code (BTC, ETH)"}
            type="text"
            name="token"
          />
        </label>
        <label htmlFor="amount">
          <input
            className="styled-input"
            onChange={(e) => setAmount(e.target.value)}
            value={amount}
            placeholder={"amount"}
            type="number"
            step="any"
            name="amount"
          />
        </label>
        <button className="btn-submit" type="submit">
          Add
        </button>
        {errorMessage && <span style={{ color: "red" }}>{errorMessage}</span>}
      </form>
    </>
  );
}
