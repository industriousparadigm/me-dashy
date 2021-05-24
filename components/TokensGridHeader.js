import { Box } from "styles/Box"
import { GreyedOutText } from "styles/GreyedOutText"
import { GridRow } from "styles/GridRow"
import { LogoBox } from "styles/LogoBox"

export default function TokensGridHeader() {
  return (
    <GridRow>
      <LogoBox>
        <GreyedOutText>Logo</GreyedOutText>
      </LogoBox>
      <Box>
        <GreyedOutText>Token</GreyedOutText>
      </Box>
      <Box>
        <GreyedOutText>Market value</GreyedOutText>
      </Box>
      <Box>
        <GreyedOutText>Amount (click to edit)</GreyedOutText>
      </Box>
      <Box size={10}>
        <GreyedOutText>% wallet</GreyedOutText>
      </Box>
    </GridRow>
  )
}
