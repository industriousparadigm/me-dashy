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
import { LogoBox } from "styles/LogoBox"
import Spacer from "styles/Spacer"

export default function TokenCard({
  editAsset,
  deleteAsset,
  tokenAttrs: { name, id, price, amountHeld, usdValueHeld, "1d": oneDay },
  userUsdTotal,
}) {
  const [showInput, toggleInput] = useState(false)
  const [showEditButton, toggleEditButton] = useState(false)
  const [inputAmount, setInputAmount] = useState(amountHeld || 0)

  const amountInputElement = useRef(null)

  const { user } = useAuth()

  const onEdit = () => {
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
      onMouseEnter={() => toggleEditButton(true)}
      onMouseLeave={() => toggleEditButton(false)}
      key={id}
    >
      <LogoBox>
        {id !== "USD" ? (
          <Logo src={getLogoUrl(name)} />
        ) : (
          <UsdIcon width={48} height={48} />
        )}
      </LogoBox>
      <Box>
        <strong>{name}</strong>
        <GreyedOutText>{id}</GreyedOutText>
      </Box>
      <Box>
        <p>{` $${beautifyNumber(price)}`}</p>
        {pctChange24h ? <Percentage24hChange value={pctChange24h} /> : null}
      </Box>
      <Box onClick={() => !showInput && onEdit()}>
        {showInput ? (
          <FormAddToken onSubmit={onAmountSubmit}>
            <InputTokenAmount
              ref={amountInputElement}
              value={inputAmount}
              onChange={(e) => setInputAmount(e.target.value)}
              type="number"
              step="any"
            />
            <Spacer size={4} />
            <FormButtons>
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
              <DeleteButton onClick={onDelete}>
                <i className="fa fa-trash"></i>
              </DeleteButton>
            </FormButtons>
          </FormAddToken>
        ) : (
          <p>{beautifyNumber(amountHeld)}</p>
        )}

        {!showInput && (
          <GreyedOutText>{`$${beautifyNumber(usdValueHeld)}`}</GreyedOutText>
        )}
      </Box>
      <Box size={10}>
        {!showInput && (
          <p>{beautifyNumber((usdValueHeld / userUsdTotal) * 100, 1)}%</p>
        )}
      </Box>
      {/* {showEditButton && !showInput && (
        <EditButton onClick={onEdit}>
          <i className="fa fa-edit"></i>
        </EditButton>
      )} */}
    </Card>
  )
}

const Card = styled(GridRow)`
  border: 1px solid lightgray;
  border-radius: 8px;
  transition: color 0.25s ease;
  height: 70px;
`

const Logo = styled.img`
  object-fit: contain;
  width: ${(p) => p.size || 48}px;
  height: ${(p) => p.size || 48}px;

  @media only screen and (max-width: 520px) {
    width: 32px;
    height: 32px;
  }
`

const Button = styled.button`
  font-weight: 900;
  border: none;
  padding: 4px 8px;
  border-radius: 5px;

  @media only screen and (max-width: 520px) {
    ${"" /* display: none; */}
    ${"" /* right: 14%; */}
  }
`

const DeleteButton = styled(Button)`
  bottom: 0;
  color: white;
  background-color: coral;

  &:hover {
    background-color: tomato;
  }
`

const EditButton = styled(Button)`
  color: white;
  background-color: skyblue;
  position: absolute;
  right: 8px;

  &:hover {
    background-color: deepskyblue;
  }
`

const FormAddToken = styled.form`
  display: flex;
  flex-direction: column;
`

const InputTokenAmount = styled.input`
  width: 100%;
`

const FormButtons = styled.div`
  display: flex;
  justify-content: flex-start;
`
