import { Box } from "styles/Box";
import { GreyedOutText } from "styles/GreyedOutText";
import { GridRow } from "styles/GridRow";

export default function TokensGridHeader() {
  return (
    <GridRow>
      <Box size={12}>
        <GreyedOutText>Logo</GreyedOutText>
      </Box>
      <Box>
        <GreyedOutText>Token</GreyedOutText>
      </Box>
      <Box>
        <GreyedOutText>Market value</GreyedOutText>
      </Box>
      <Box>
        <GreyedOutText>Amount held</GreyedOutText>
      </Box>
      <Box size={10}>
        <GreyedOutText>% wallet</GreyedOutText>
      </Box>
    </GridRow>
  );
}
