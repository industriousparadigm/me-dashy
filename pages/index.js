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

  return (
    <div className={styles.container}>
      <DashboardHead />
      <main className={styles.main}>
        <h1 className={styles.title}>Me Dashy</h1>
        <p className={styles.description}>
          {`A dashboard for the cripto grabbers`}
        </p>
        {!user ? (
          <h1>
            <Link href="/login">Log in</Link>
          </h1>
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

export async function getServerSideProps({ req }) {
  const tokens = await getTokens();
  return {
    props: {
      tokens,
    },
  };
}
