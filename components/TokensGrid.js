import styles from "styles/Home.module.css";
import TokenCard from "./TokenCard";
import TokenAdder from "./TokenAdder";

export const TokensGrid = ({ userAssets, editAsset }) => {
  const userHasAssets = Array.isArray(userAssets) && userAssets.length > 0;

  return (
    <>
      <div className={styles.grid}>
        {userHasAssets ? (
          userAssets.map((asset) => (
            <TokenCard
              tokenAttrs={asset}
              editAsset={editAsset}
              key={asset.id}
            />
          ))
        ) : (
          <h3>You have no cripto :(</h3>
        )}
      </div>
      <TokenAdder />
    </>
  );
};
