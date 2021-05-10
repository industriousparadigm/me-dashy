import React from "react"
import Link from "next/link"
import useAuth from "hooks/useAuth"
import KrakenClient from "kraken-api"

export default function ProfilePage({
  userBalance,
  userClosedOrders,
  totalFeesPaid,
}) {
  return <h1>nothing to see here</h1>
  // const { user } = useAuth()
  // console.log({ user, userBalance, userClosedOrders, totalFeesPaid })
  // return (
  //   <div>
  //     {user ? (
  //       <code>{JSON.stringify(user, null, 2)}</code>
  //     ) : (
  //       <Link href="/login">Log in</Link>
  //     )}
  //   </div>
  // )
}

export async function getServerSideProps() {
  // const key = process.env.KRAKEN_API_KEY
  // const secret = process.env.KRAKEN_PRIVATE_KEY
  // const kraken = new KrakenClient(key, secret)
  // console.log(kraken.api.toString())
  // const userBalance = await kraken.api("Balance")
  // const userClosedOrders = await kraken.api("ClosedOrders")
  // const totalFeesPaid = Object.keys(userClosedOrders.result.closed).reduce(
  //   (sum, orderKey) =>
  //     sum + parseFloat(userClosedOrders.result.closed[orderKey].fee),
  //   0
  // )
  // return {
  //   props: {
  //     userBalance,
  //     userClosedOrders,
  //     totalFeesPaid,
  //   },
  // }
}
