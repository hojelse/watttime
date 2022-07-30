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
      <Page style={{
        height: "100%",
        minHeight: "100vh",
        width: "100%",
        paddingTop: "2em",
        backgroundColor: "var(--color-background)",
      }}>
        <InterativeChart data={pricesTransformed}/>
      </Page>
    </>
  )
}

const Page = styled.div`
  & > * {
    padding: 0 10px
  }
`

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