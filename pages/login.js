import { useRouter } from "next/router"
import { Magic } from "magic-sdk"
import Head from "next/head"
import styled from "styled-components"
import Spacer from "styles/Spacer"

export default function Login() {
  const router = useRouter()

  const handleSubmit = async (event) => {
    event.preventDefault()

    const { elements } = event.target

    // Add the Magic code here
    const decentralizedId = await new Magic(
      process.env.NEXT_PUBLIC_MAGIC_PUB_KEY
    ).auth.loginWithMagicLink({ email: elements.email.value })

    // Once we have the token from magic,
    // update our own database

    const authRequest = await fetch("/api/login", {
      method: "POST",
      headers: { Authorization: `Bearer ${decentralizedId}` },
    })

    if (authRequest.ok) {
      // We successfully logged in, our API
      // set authorization cookies and now we
      // can redirect to the dashboard!
      router.push("/")
    } else {
      console.info("Authentication failed.")
    }
  }

  return (
    <>
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
          if (document.cookie && document.cookie.includes('authed')) {
            window.location.href = "/"
          }
        `,
          }}
        />
      </Head>
      <Wrapper>
        <h2>A log in link will be sent to your email</h2>
        <Spacer size={16} />
        <Form onSubmit={handleSubmit}>
          <Label htmlFor="email">
            <Input
              // onChange={(e) => setTokenId(e.target.value)}
              // value={tokenId}
              placeholder={"email"}
              type="email"
              name="email"
            />
          </Label>
          <Spacer size={4} />
          <Button type="submit">Log in</Button>
        </Form>
      </Wrapper>
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

const Wrapper = styled.main`
  margin: 0 auto;
  padding: 6rem 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 800px;
`
