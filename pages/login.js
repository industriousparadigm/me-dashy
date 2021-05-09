import { useRouter } from "next/router"
import { Magic } from "magic-sdk"
import Head from "next/head"

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
      <form onSubmit={handleSubmit} className={"flex-form login-form"}>
        <h3>A log in link will be sent to your email</h3>
        <label htmlFor="email">Email</label>
        <input className="styled-input" name="email" type="email" />
        <button className="btn-submit">Send me a link!</button>
      </form>
    </>
  )
}
