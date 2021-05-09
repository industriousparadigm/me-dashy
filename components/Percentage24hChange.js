import { beautifyNumber } from "lib";
import styled from "styled-components";

export const Percentage24hChange = ({ value }) => (
  <Wrapper value={value}>
    {value > 0 ? "+" : ""}
    {beautifyNumber(value)}%
  </Wrapper>
);

const Wrapper = styled.span`
  color: ${(p) => (p.value > 0 ? "hsl(145, 45%, 53%)" : "hsl(6, 78%, 66%)")};
`;
