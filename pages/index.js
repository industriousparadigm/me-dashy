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
} from "lib";
import useAuth from "hooks/useAuth";

export default function Home({ tokens }) {
  const [userAssets, setUserAssets] = useState([]);
  const [userUsdTotal, setUserUsdTotal] = useState(0);

  const { user, loading } = useAuth();

  useEffect(() => {
    if (user && Array.isArray(tokens)) {
      const updatedAssets = buildUserAssets(user, tokens);
      const updatedUsdTotal = getUserUsdTotal(updatedAssets);
      setUserAssets(updatedAssets);
      setUserUsdTotal(updatedUsdTotal);
    }
  }, [user, tokens]);

  console.log({ user, loading, tokens });

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
            <h2>{`Your assets are worth $${beautifyNumber(userUsdTotal)}`}</h2>
            <TokensGrid userAssets={userAssets} />
          </>
        )}
      </main>

      <footer className={styles.footer}>Rumo a Marte!</footer>
    </div>
  );
}

export async function getServerSideProps() {
  // avoid querying all 5000+ tokens
  const userAssets = process.env.TOKENS_SUPPORTED;

  const tokens = await getTokens(userAssets);

  // TODO: use req to somehow get user (presumably from cookies)
  // and send data nicely shaped already to the frontend

  return {
    props: {
      tokens,
    },
  };
}
