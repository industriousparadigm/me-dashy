import Image from "next/image";
import styles from "styles/Home.module.css";
import mockUser from "data/mock-user";
import { beautifyNumber } from "lib";

export const TokensGrid = ({ tokens }) => (
  <div className={styles.grid}>
    {tokens.map((token) => {
      if (!mockUser.assets[token.id]) return null;
      const usdTotal = beautifyNumber(token.price * mockUser.assets[token.id]);

      return (
        <div className={styles.card} key={token.id}>
          <Image src={token.logo_url} width={80} height={80} />
          <div className={styles.tokenvalues}>
            <p>
              <strong>{token.name}</strong>
              <span className={styles.greyedout}>{`   $${beautifyNumber(
                token.price
              )}`}</span>
            </p>
            <p>{beautifyNumber(mockUser.assets[token.id])}</p>
            <h3>{`$${usdTotal}`}</h3>
          </div>
        </div>
      );
    })}
  </div>
);
