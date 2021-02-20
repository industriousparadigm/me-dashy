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
  const [showDelete, toggleDelete] = useState(false);
  const [inputAmount, setInputAmount] = useState(amountHeld || 0);

  const amountInput = useRef(null);

  const { user } = useAuth();

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

  const onCloseInput = () => {
    toggleInput(false);
    setInputAmount(amountHeld);
  };

  return (
    <div
      onMouseEnter={() => toggleDelete(true)}
      onMouseLeave={() => toggleDelete(false)}
      className={styles.card}
      key={id}
    >
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
          <form className="token-add-form" onSubmit={onAmountSubmit}>
            <input
              className="styled-input input-small"
              ref={amountInput}
              value={inputAmount}
              onChange={(e) => setInputAmount(e.target.value)}
              type="number"
              step="any"
            />
            <button type="submit" className="btn token-add-btn btn-pad-more">
              <i className="fa fa-floppy-o"></i>
            </button>
            <button
              onClick={onCloseInput}
              className="btn token-add-btn btn-pad-more"
              style={{
                backgroundColor: "orange",
              }}
            >
              <i className="fa fa-close"></i>
            </button>
          </form>
        ) : (
          <p onClick={onAmountClick}>{beautifyNumber(amountHeld)}</p>
        )}
        <h3>{`$${beautifyNumber(usdValueHeld)}`}</h3>
      </div>
      {showDelete && (
        <button onClick={onDelete} className="delete-button">
          <i className="fa fa-trash"></i>
        </button>
      )}{" "}
    </div>
  );
}
