import { useEffect, useState } from 'react'
import logo from './logo.svg'
import './App.css'
import type { DatasetQuery }  from '../graphql/generated'
import { GraphQLClient, gql } from 'graphql-request'
import * as d3 from 'd3'

const GetDataset = gql`
query Dataset {
  elspotprices(
    where: {
      PriceArea: {_eq: "DK2"}
    }
    order_by: {
      HourUTC: desc
    }
    limit: 168
    offset: 0
  )
  {HourUTC HourDK PriceArea SpotPriceDKK SpotPriceEUR }
}
`

function App() {
  const [data, setBlah] = useState<DatasetQuery | undefined>(undefined)

  useEffect(() => {
    const loader = async () => {  
      const githubapi = new GraphQLClient(
        "https://data-api.energidataservice.dk/v1/graphql"
      )
    
      const resp = await githubapi.request(GetDataset)
    
      return resp as DatasetQuery
    }

    loader().then(x => setBlah(x))
  }, [])

  return (
    <>
      <Chart data={data}/>
    </>
  )
}

export function Chart({ data } : { data: DatasetQuery | undefined }) {
  if (data == undefined) return null

  var priceList = data.elspotprices


  const blah = priceList.map(
    ({HourDK, SpotPriceEUR}) => {

    const priceEur = SpotPriceEUR as number;
    const moms = 1.25;
    const eurToDkk = 7.5;
    const mwtToKwt = 0.001;
    const price = priceEur * moms * eurToDkk * mwtToKwt;

    return {
      date: new Date(HourDK),
      price: price
    }
  })

  const [dataset, setDataset] = useState(blah)

  let x = d3.scaleTime()
    .domain([dataset[0].date, dataset[167].date])
    .range([ 0, 167 ])

  const path = dataset.reduce((prev, curr, idx) => {
    return `${prev},${curr.price} l 1,0 L ${idx+1}`
  }, "M 0") + "0"

  return (
    <svg viewBox={`-1 -1 170 10`} style={{height: "100vh"}}>
      <path
        d={path}
        fill="none"
        stroke="#000"
        strokeWidth="0.05"
      />
      {
        dataset.map(({date, price}) => {
          return (
            <>
              <circle
                cx={x(date)}
                cy={price}
                r="0.1"
              />
            </>
          )
        })
      }
    </svg>
  )
}

export default App
