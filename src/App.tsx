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

  var prices = data.elspotprices

  const pricesTransformed = prices.map(
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
  .reverse()
 
  const [dataset, setDataset] = useState(pricesTransformed)

  
  const XMAX = dataset.length-1
  let YMAX = dataset.reduce((prev, curr) => {
    return curr.price > prev ? curr.price : prev;
  }, 0)
  YMAX = Math.round(YMAX) + 1
  const BASELINE = YMAX

  let x = d3.scaleTime()
    .domain([dataset[0].date, dataset[167].date])
    .range([ 0, XMAX ])

  const stepCurve = dataset.reduce((prev, curr, idx) => {
    return `${prev},${BASELINE - curr.price} l 1,0 L ${idx+1}`
  }, "M 0") + "0"

  const yaxis = [0, 1, 2, 3, 4, 5]

  return (
    <svg viewBox={`-1 -1 ${XMAX+3} ${YMAX+2}`} style={{height: "100vh"}}>
      <path
        d={`M 0 ${BASELINE - YMAX} L 0 ${BASELINE} L ${XMAX+1} ${BASELINE}`}
        fill="none"
        stroke="#000"
        strokeWidth="0.05"
      />
      {
        yaxis.map(y => {
          return (
            <>
              <text
                x={0}
                y={BASELINE-y}
                font-size="0.01em"
                textAnchor="end"
                dominantBaseline="central"
                dx="-1em"
              >
                {`${y} DKK`}
              </text>
              <path
                d={`M 0 ${BASELINE-y} l ${XMAX+1} 0`}
                fill="none"
                stroke="#000"
                strokeWidth="0.01"
              />
            </>
          )
        })
      }
      <path
        d={stepCurve}
        fill="none"
        stroke="#000"
        strokeWidth="0.05"
      />
      {
        dataset.map(({date, price}) => {
          return (
            <>
              <text
                x={x(date)}
                y={BASELINE}
                font-size="0.01em"
                textAnchor="middle"
                dominantBaseline="hanging"
                dy="0.5em"
              >
                {date.toLocaleString("da-DK", { hour: "2-digit", minute: "2-digit" })}
              </text>
              <text
                x={x(date)+0.5}
                y={BASELINE-price}
                font-size="0.01em"
                textAnchor="middle"
                dy="-0.5em"
              >
                {Math.round(price*100)/100}
              </text>
            </>
          )
        })
      }
    </svg>
  )
}

export default App
