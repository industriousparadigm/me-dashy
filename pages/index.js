import { useState, useEffect } from "react"
import styled from "styled-components"
import Link from "next/link"
import { useRouter } from "next/router"
import Spacer from "styles/Spacer"
import { GreyedOutText } from "styles/GreyedOutText"
import { Box } from "styles/Box"
import { DashboardHead } from "components/DashboardHead"
import { TokensGrid } from "components/TokensGrid"
import { editAssetAmountInDatabase } from "lib/api"
import useAuth from "hooks/useAuth"
import {
  getTokens,
  beautifyNumber,
  buildUserAssets,
  getUserUsdTotal,
  buildCriptoAsset,
  buildUsdAsset,
  getSupportedCriptoCodes,
} from "lib"

export default function Home({ tokens }) {
  const [userAssets, setUserAssets] = useState([])

  const router = useRouter()

  const { user, loading } = useAuth()

  useEffect(() => {
    if (user && Array.isArray(tokens)) {
      const updatedAssets = buildUserAssets(user, tokens)
      setUserAssets(updatedAssets)
    }
  }, [user, tokens])

  const refreshData = () => {
    router.replace(router.asPath)
  }

  const addAsset = (tokenId, amount) => {
    const isFiat = process.env.NEXT_PUBLIC_FIAT_SUPPORTED.includes(
      tokenId.toUpperCase()
    )
    // build a user asset
    const newAsset = isFiat
      ? buildUsdAsset({ tokenId, amount })
      : buildCriptoAsset({ tokenId, amount }, tokens)

    // add it to the userAssets array
    const updatedUserAssets = [...userAssets, newAsset]
    updatedUserAssets.sort((a, b) => b.usdValueHeld - a.usdValueHeld)

    setUserAssets(updatedUserAssets)
  }

  const editAsset = async (tokenId, newAmount) => {
    // get index of asset to update
    const index = userAssets.findIndex((asset) => asset.id === tokenId)

    // get database ID for this user-asset combo
    const { id } = user.assets.find((asset) => asset.tokenId === tokenId)

    // update asset amount in database
    const payload = {
      id,
      amount: parseFloat(newAmount),
    }

    const result = await editAssetAmountInDatabase(payload)

    if (!result) return

    // copy old asset and update its amount
    const assetToUpdate = { ...userAssets[index] }
    assetToUpdate.amountHeld = newAmount
    assetToUpdate.usdValueHeld = newAmount * parseFloat(assetToUpdate.price)

    // create a new userAssets object and assign it the edited asset
    const updatedAssets = [...userAssets]
    updatedAssets[index] = assetToUpdate

    // set state
    setUserAssets(updatedAssets)
  }

  const deleteAsset = (assetId) => {
    const updatedAssets = []
    userAssets.forEach(
      (asset) => asset.id !== assetId && updatedAssets.push(asset)
    )
    setUserAssets(updatedAssets)
  }

  // calculate total on every render
  const userUsdTotal = getUserUsdTotal(userAssets)

  return (
    <Wrapper>
      <DashboardHead />
      <Dashboard>
        <Header>Me Dashy</Header>
        <SubTitle>{`A dashboard for cripto grabbers`}</SubTitle>
        <Spacer size={16} />
        {!user ? (
          <h1>{loading ? "Loading..." : <Link href="/login">Log in</Link>}</h1>
        ) : (
          <>
            {userAssets.length > 0 && (
              <>
                <WalletTotalContainer align="center">
                  <GreyedOutText as="h3">Wallet total</GreyedOutText>
                  <WalletTotal>
                    {"$" + beautifyNumber(userUsdTotal)}
                  </WalletTotal>
                </WalletTotalContainer>
                <Refresh
                  onClick={refreshData}
                  className="refresh fa fa-refresh fa-2x"
                ></Refresh>
                <Spacer size={12} />
              </>
            )}
            <TokensGrid
              userAssets={userAssets}
              addAsset={addAsset}
              editAsset={editAsset}
              deleteAsset={deleteAsset}
            />
          </>
        )}
      </Dashboard>

      <Footer>Rumo a Marte!</Footer>
    </Wrapper>
  )
}

export async function getServerSideProps() {
  // avoid querying all 5000+ tokens
  const tokensToQuery = getSupportedCriptoCodes()
  const tokens = await getTokens(tokensToQuery)

  return {
    props: {
      tokens,
    },
  }
}

const Wrapper = styled.div`
  min-height: 100vh;
  padding: 0 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Dashboard = styled.main`
  padding: 5rem 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 800px;
`

const Header = styled.h1`
  font-family: "Racing Sans One", cursive;
  margin: 0;
  line-height: 1.15;
  font-size: 4rem;
`

const SubTitle = styled.h2`
  font-family: "Share Tech Mono", monospace;
  line-height: 1.5;
  font-size: 1.5rem;
`

const WalletTotalContainer = styled(Box)`
  font-size: 1.125rem;
  line-height: 1.5;
`

const WalletTotal = styled.h3`
  font-size: 1.625rem;
  font-weight: bold;
`

const Footer = styled.footer`
  width: 100%;
  height: 100px;
  border-top: 1px solid #eaeaea;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Refresh = styled.i`
  padding: 4px;
`
