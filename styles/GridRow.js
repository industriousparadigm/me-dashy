import styled from "styled-components"

export const GridRow = styled.div`
  position: relative;
  font-size: 14px;
  width: 100%;
  display: flex;
  gap: 16px;
  align-items: flex-start;
  justify-content: space-between;
  padding: 8px 16px;

  > * {
    align-self: center;
  }
`
