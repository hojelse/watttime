import type { NextPage } from 'next'
import { Table } from '../components/Table'
import { Chart } from '../components/Chart'

export type DataEntries = {
  date: Date
  price: number
  isFuture: boolean
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


export async function getStaticProps() {
  const res = await fetch(`https://api.energidataservice.dk/dataset/Elspotprices?limit=48&offset=0&sort=HourUTC DESC&timezone=utc+1&filter={"PriceArea":"DK2"}`)
  const data = await res.json()

  return {
    props: { data },
    revalidate: 60*60
  }
}

export default Home
