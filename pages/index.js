import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "styles/Home.module.css";
import { DashboardHead } from "components/DashboardHead";
import { TokensGrid } from "components/TokensGrid";
import {
  getTokens,
  beautifyNumber,
  buildUserAssets,
  getUserUsdTotal,
  buildCriptoAsset,
} from "lib";
import useAuth from "hooks/useAuth";
import { editAssetAmountInDatabase } from "lib/api";

export default function Home({ tokens }) {
  const [userAssets, setUserAssets] = useState([]);

  const { user, loading } = useAuth();

  useEffect(() => {
    if (user && Array.isArray(tokens)) {
      const updatedAssets = buildUserAssets(user, tokens);
      setUserAssets(updatedAssets);
    }
  }, [user, tokens]);

  const addAsset = (tokenId, amount) => {
    // build a user asset
    const newAsset = buildCriptoAsset({ tokenId, amount }, tokens);

    // add it to the userAssets array
    const updatedUserAssets = [...userAssets, newAsset];
    updatedUserAssets.sort((a, b) => b.usdValueHeld - a.usdValueHeld);

    setUserAssets(updatedUserAssets);
  };

  const editAsset = async (tokenId, newAmount) => {
    // get index of asset to update
    const index = userAssets.findIndex((asset) => asset.id === tokenId);

    // get database ID for this user-asset combo
    const { id } = user.assets.find((asset) => asset.tokenId === tokenId);

    // update asset amount in database
    const payload = {
      id,
      amount: parseFloat(newAmount),
    };

    const result = await editAssetAmountInDatabase(payload);

    if (!result) return;

    // copy old asset and update its amount
    const assetToUpdate = { ...userAssets[index] };
    assetToUpdate.amountHeld = newAmount;
    assetToUpdate.usdValueHeld = newAmount * parseFloat(assetToUpdate.price);

    // create a new userAssets object and assign it the edited asset
    const updatedAssets = [...userAssets];
    updatedAssets[index] = assetToUpdate;

    // set state
    setUserAssets(updatedAssets);
  };

  const deleteAsset = (assetId) => {
    const updatedAssets = [];
    userAssets.forEach(
      (asset) => asset.id !== assetId && updatedAssets.push(asset)
    );
    setUserAssets(updatedAssets);
  };

  // calculate total on every render
  const userUsdTotal = getUserUsdTotal(userAssets);

  return (
    <div className={styles.container}>
      <DashboardHead />
      <main className={styles.main}>
        <h1 className={styles.title}>Me Dashy</h1>
        <p className={styles.description}>
          {`A dashboard for the cripto grabbers`}
        </p>
        {!user ? (
          <h1>{loading ? "Loading..." : <Link href="/login">Log in</Link>}</h1>
        ) : (
          <>
            {userAssets.length > 0 && (
              <h2>{`Your assets are worth $${beautifyNumber(
                userUsdTotal
              )}`}</h2>
            )}
            <TokensGrid
              userAssets={userAssets}
              addAsset={addAsset}
              editAsset={editAsset}
              deleteAsset={deleteAsset}
            />
          </>
        )}
      </main>

      <footer className={styles.footer}>Rumo a Marte!</footer>
    </div>
  );
}

export async function getServerSideProps() {
  // avoid querying all 5000+ tokens
  const tokens = await getTokens(process.env.NEXT_PUBLIC_TOKENS_SUPPORTED);

  // TODO: use req to somehow get user (presumably from cookies)
  // and send data nicely shaped already to the frontend

  return {
    props: {
      tokens,
    },
  };
}
