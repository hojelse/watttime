import type { NextPage } from 'next'
import { Table } from './Table'
import { Chart } from './Chart'

export type DataEntries = {
  date: Date
  price: number
}[]

type Data = {
  data: {
    dataset: string,
    records: {
      HourDK: string
      HourUTC: string
      PriceArea: string
      SpotPriceDKK: number
      SpotPriceEUR: number
    }[]
  }
}

const Home: NextPage<Data> = ({ data }) => {
  const prices = data.records
  const pricesTransformed = prices.map(
    ({HourDK, SpotPriceEUR}) => {

    return {
      date: new Date(HourDK),
      price: tranformPrice(SpotPriceEUR)
    }
  })

  return (
    <>
      <Chart data={pricesTransformed}/>
      {/* <p>Time of last data fetch: {lastFetchTime != undefined ? lastFetchTime.toUTCString() : "No data yet"}</p> */}
      <Table data={pricesTransformed}/>
    </>
  )
}

function tranformPrice(SpotPriceEUR: any) {
  const priceEur = SpotPriceEUR as number
  const moms = 1.25
  const eurToDkk = 7.5
  const mwtToKwt = 0.001
  const price = priceEur * moms * eurToDkk * mwtToKwt
  return price
}


export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`https://api.energidataservice.dk/dataset/Elspotprices?limit=36&offset=0&sort=HourUTC DESC&timezone=utc+1&filter={"PriceArea":"DK2"}`)
  const data = await res.json()

  // Pass data to the page via props
  return { props: { data } }
}

export default Home
