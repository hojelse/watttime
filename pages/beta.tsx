import { NextPage } from "next/types"
import styled from "styled-components"
import { Data, tranformPrice } from "."
import { InterativeChart } from "../components/InteractiveChart"

const Beta: NextPage<Data> = ({ data }) => {
  const prices = data.records

  const currentDate = new Date()
  currentDate.setHours(new Date().getHours() - 1)
  
  const pricesTransformed = prices.map(
    ({HourDK, SpotPriceEUR}) => {
    
    const newDate: Date = new Date(HourDK)

    return {
      date: newDate,
      price: tranformPrice(SpotPriceEUR),
      isFuture: currentDate < newDate
    }
  })

  return (
    <>
      <div
        className="page"
        style={{
          height: "100dvh",
          width: "100%",
          padding: "3em 0",
          backgroundColor: "var(--color-background)",
          display: "grid",
          gridTemplateRows: "auto auto 1fr auto"
        }}
      >
        <InterativeChart data={pricesTransformed}/>
      </div>
    </>
  )
}

export async function getStaticProps() {
  const hourCount = 24*30
  const res = await fetch(`https://api.energidataservice.dk/dataset/Elspotprices?limit=${hourCount}&offset=0&sort=HourUTC DESC&timezone=utc+1&filter={"PriceArea":"DK2"}`)
  const data = await res.json()

  return {
    props: { data },
    revalidate: 60*60
  }
}

export default Beta