import Image from "next/image";
import styles from "styles/Home.module.css";
import UsdIcon from "components/UsdIcon";
import { beautifyNumber } from "lib";

export const TokensGrid = ({ userAssets }) => {
  if (!Array.isArray(userAssets) || userAssets.length === 0) {
    return <h3>You have no cripto :(</h3>;
  }

  return (
    <div className={styles.grid}>
      {userAssets.map(
        ({ id, name, price, logo_url, amountHeld, usdValueHeld }) => (
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
              <p>{beautifyNumber(amountHeld)}</p>
              <h3>{`$${beautifyNumber(usdValueHeld)}`}</h3>
            </div>
          </div>
        )
      )}
    </div>
  );
};
