import styles from "styles/Home.module.css";
import mockUser from "data/mock-user";
import { SiteHead } from "components/SiteHead";
import { TokensGrid } from "components/TokensGrid";
import { getTokens } from "lib";

export default function Home({ tokens }) {
  return (
    <div className={styles.container}>
      <SiteHead />
      <main className={styles.main}>
        <h1 className={styles.title}>Me Dashy</h1>
        <p className={styles.description}>
          {`A dashboard for the cripto grabbers. Welcome ${mockUser.name}!`}
        </p>
        <TokensGrid tokens={tokens} />
      </main>

      <footer className={styles.footer}>Rumo a Marte!</footer>
    </div>
  );
}

export async function getServerSideProps() {
  const tokens = await getTokens(mockUser.assets);
  return {
    props: {
      tokens,
    },
  };
}
