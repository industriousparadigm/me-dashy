import Image from "next/image";
import styles from "styles/Home.module.css";
import UsdIcon from "components/UsdIcon";
import { beautifyNumber } from "lib";
import { useState, useRef } from "react";
import useAuth from "hooks/useAuth";
import { deleteAssetFromDatabase } from "lib/api";

export default function TokenCard({
  editAsset,
  deleteAsset,
  tokenAttrs: { logo_url, name, id, price, amountHeld, usdValueHeld },
}) {
  const [showInput, toggleInput] = useState(false);
  const [inputAmount, setInputAmount] = useState(amountHeld || 0);

  const amountInput = useRef(null);

  const { user } = useAuth();

  console.log({ user });

  const onAmountClick = () => {
    toggleInput(!showInput);
    setTimeout(() => amountInput.current?.focus(), 0);
  };

  const onAmountSubmit = (event) => {
    event.preventDefault();
    editAsset(id, parseFloat(inputAmount));
    toggleInput(!showInput);
  };

  const onDelete = async () => {
    const assetToDelete = user.assets.find((asset) => asset.tokenId === id);
    await deleteAssetFromDatabase({ id: assetToDelete.id });
    deleteAsset(id);
  };

  return (
    <div className={styles.card} key={id}>
      {logo_url && <Image src={logo_url} width={80} height={80} />}
      {id === "USD" && <UsdIcon width={80} height={80} />}
      <div className={styles.tokenvalues}>
        <p>
          <strong>{name}</strong>
          <span className={styles.greyedout}>{` $${beautifyNumber(
            price
          )}`}</span>
        </p>
        {showInput ? (
          <form onSubmit={onAmountSubmit}>
            <input
              ref={amountInput}
              onChange={(e) => setInputAmount(e.target.value)}
              type="number"
              step="any"
            />
          </form>
        ) : (
          <p onClick={onAmountClick}>{beautifyNumber(amountHeld)}</p>
        )}
        <h3>{`$${beautifyNumber(usdValueHeld)}`}</h3>
      </div>
      <button
        onClick={onDelete}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          margin: "5px",
          color: "red",
          fontWeight: 900,
        }}
      >
        X
      </button>
    </div>
  );
}
