import useAuth from "hooks/useAuth"
import { badInputsCheck, isFiat, isStablecoin } from "lib"
import { createAssetInDatabase } from "lib/api"
import { useState } from "react"
import styled from "styled-components"
import Spacer from "styles/Spacer"

export default function TokenAdder({ userAssets, addAsset }) {
  const [tokenId, setTokenId] = useState("")
  const [amount, setAmount] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const { user } = useAuth()

  const onFormSubmit = async (event) => {
    event.preventDefault()

    // find user id
    const userPrismaId = user.prismaId

    const sanitizedInputs = {
      tokenId: tokenId.toUpperCase(),
      amount: parseFloat(amount),
      isFiat: isFiat(tokenId),
      isStable: isStablecoin(tokenId),
      ownerId: userPrismaId,
    }

    // stop if inputs are bad
    const errorMessage = badInputsCheck(userAssets, sanitizedInputs)
    if (errorMessage) {
      setErrorMessage(errorMessage)
      return
    }

    // add token to database and attach to current user
    const result = await createAssetInDatabase(sanitizedInputs)

    // add token in React UI
    if (result) addAsset(result.tokenId, result.amount)

    // clear form
    setAmount("")
    setTokenId("")
    setErrorMessage("")
  }

  return (
    <>
      <h2>Add a token</h2>
      <Spacer size={8} />
      <Form onSubmit={onFormSubmit}>
        <Label htmlFor="tokenId">
          <Input
            onChange={(e) => setTokenId(e.target.value)}
            value={tokenId}
            placeholder={"token code (BTC, ETH)"}
            type="text"
            name="token"
          />
        </Label>
        <Spacer size={4} />
        <Label htmlFor="amount">
          <Input
            onChange={(e) => setAmount(e.target.value)}
            value={amount}
            placeholder={"amount"}
            type="number"
            step="any"
            name="amount"
          />
        </Label>
        <Spacer size={4} />
        <Button type="submit">Add</Button>
      </Form>
      <Spacer size={12} />
      {errorMessage && <span style={{ color: "red" }}>{errorMessage}</span>}
    </>
  )
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  width: 256px;
`

const Label = styled.label`
  width: 100%;
`

const Input = styled.input`
  width: 100%;
  background-color: transparent;
  border-radius: 8px;
  border: 1px solid #999;
  padding: 10px 15px;
`

const Button = styled.button`
  padding: 12px 16px;
  width: 100%;
  background-color: #000;
  color: #fff;
  border-radius: 7px;
  font-weight: bold;
  text-transform: uppercase;
`
