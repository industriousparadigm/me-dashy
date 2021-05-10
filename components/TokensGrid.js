import styled from "styled-components"
import TokenCard from "./TokenCard"
import TokenAdder from "./TokenAdder"
import { getUserUsdTotal } from "lib"
import TokensGridHeader from "./TokensGridHeader"
import Spacer from "styles/Spacer"

export const TokensGrid = ({
  userAssets,
  addAsset,
  editAsset,
  deleteAsset,
}) => {
  const userHasAssets = Array.isArray(userAssets) && userAssets.length > 0

  return (
    <>
      <Wrapper>
        {userHasAssets ? (
          <>
            <TokensGridHeader />
            {userAssets.map((asset) => {
              return (
                <>
                  <TokenCard
                    tokenAttrs={asset}
                    userUsdTotal={getUserUsdTotal(userAssets)}
                    editAsset={editAsset}
                    deleteAsset={deleteAsset}
                    key={asset.id}
                  />
                  <Spacer size={2} />
                </>
              )
            })}
          </>
        ) : (
          <h3>You have no cripto :(</h3>
        )}
      </Wrapper>
      <Spacer size={36} />
      <TokenAdder userAssets={userAssets} addAsset={addAsset} />
    </>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`
