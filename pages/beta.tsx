import { NextPage } from "next/types"
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
      <div style={{
        width: "100vw",
        height: "100vw",
        maxHeight: "80vh",
        padding: "10px",
        backgroundColor: "hsl(240, 0%, 100%)",
      }}>
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