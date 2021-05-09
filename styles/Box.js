import styled from "styled-components"

export const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${(p) => p.align || "left"};
  line-height: 1.2rem;
  width: ${(p) => p.size || 20}%;
`
