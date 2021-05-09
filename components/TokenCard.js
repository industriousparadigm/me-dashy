import styled from "styled-components"
import { Box } from "styles/Box"
import { GridRow } from "styles/GridRow"
import { GreyedOutText } from "styles/GreyedOutText"
import UsdIcon from "components/UsdIcon"
import { beautifyNumber, getLogoUrl } from "lib"
import { useState, useRef } from "react"
import useAuth from "hooks/useAuth"
import { deleteAssetFromDatabase } from "lib/api"
import { Percentage24hChange } from "./Percentage24hChange"

export default function TokenCard({
  editAsset,
  deleteAsset,
  tokenAttrs: { name, id, price, amountHeld, usdValueHeld, "1d": oneDay },
  userUsdTotal,
}) {
  const [showInput, toggleInput] = useState(false)
  const [showDelete, toggleDelete] = useState(false)
  const [inputAmount, setInputAmount] = useState(amountHeld || 0)

  const amountInputElement = useRef(null)

  const { user } = useAuth()

  const onAmountClick = () => {
    toggleInput(!showInput)
    setTimeout(() => amountInputElement.current?.focus(), 0)
  }

  const onAmountSubmit = (event) => {
    event.preventDefault()
    editAsset(id, parseFloat(inputAmount))
    toggleInput(!showInput)
  }

  const onDelete = async () => {
    const assetToDelete = user.assets.find((asset) => asset.tokenId === id)
    await deleteAssetFromDatabase({ id: assetToDelete.id })
    deleteAsset(id)
  }

  const onCloseInput = () => {
    toggleInput(false)
    setInputAmount(amountHeld)
  }

  const pctChange24h = parseFloat(oneDay?.price_change_pct) * 100

  return (
    <Card
      onMouseEnter={() => toggleDelete(true)}
      onMouseLeave={() => toggleDelete(false)}
      key={id}
    >
      <Box size={12}>
        {id !== "USD" ? (
          <img src={getLogoUrl(name)} width={48} height={48} />
        ) : (
          <UsdIcon width={48} height={48} />
        )}
      </Box>
      <Box>
        <strong>{name}</strong>
        <GreyedOutText>{id}</GreyedOutText>
      </Box>
      <Box>
        <p>{` $${beautifyNumber(price)}`}</p>
        {pctChange24h ? <Percentage24hChange value={pctChange24h} /> : null}
      </Box>
      <Box>
        {showInput ? (
          <form className="token-add-form" onSubmit={onAmountSubmit}>
            <input
              className="styled-input input-small"
              ref={amountInputElement}
              value={inputAmount}
              onChange={(e) => setInputAmount(e.target.value)}
              type="number"
              step="any"
            />
            <button type="submit" className="btn token-add-btn btn-pad-more">
              <i className="fa fa-floppy-o"></i>
            </button>
            <button
              onClick={onCloseInput}
              className="btn token-add-btn btn-pad-more"
              style={{
                backgroundColor: "orange",
              }}
            >
              <i className="fa fa-close"></i>
            </button>
          </form>
        ) : (
          <p onClick={onAmountClick}>{beautifyNumber(amountHeld)}</p>
        )}

        <GreyedOutText>{`$${beautifyNumber(usdValueHeld)}`}</GreyedOutText>
      </Box>
      <Box size={10}>
        <p>{beautifyNumber((usdValueHeld / userUsdTotal) * 100, 1)}%</p>
      </Box>
      {showDelete && (
        <button onClick={onDelete} className="delete-button">
          <i className="fa fa-trash"></i>
        </button>
      )}
    </Card>
  )
}

const Card = styled(GridRow)`
  border: 1px solid #eaeaea;
  border-radius: 8px;
  transition: color 0.25s ease;

  :hover,
  :focus,
  :active {
    color: #0070f3;
    border: 1px solid #0070f3;
  }
`
