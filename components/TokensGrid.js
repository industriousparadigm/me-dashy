import styled from "styled-components";
import TokenCard from "./TokenCard";
import TokenAdder from "./TokenAdder";
import { getUserUsdTotal } from "lib";
import TokensGridHeader from "./TokensGridHeader";

export const TokensGrid = ({
  userAssets,
  addAsset,
  editAsset,
  deleteAsset,
}) => {
  const userHasAssets = Array.isArray(userAssets) && userAssets.length > 0;

  return (
    <>
      <Wrapper>
        {userHasAssets ? (
          <>
            <TokensGridHeader />
            {userAssets.map((asset) => (
              <TokenCard
                tokenAttrs={asset}
                userUsdTotal={getUserUsdTotal(userAssets)}
                editAsset={editAsset}
                deleteAsset={deleteAsset}
                key={asset.id}
              />
            ))}
          </>
        ) : (
          <h3>You have no cripto :(</h3>
        )}
      </Wrapper>
      <TokenAdder userAssets={userAssets} addAsset={addAsset} />
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 4px;
`;
