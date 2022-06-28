import { useEffect, useState } from 'react'
import styled from 'styled-components'
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
    limit: 48
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
      <Table data={data}/>
    </>
  )
}

export function Table({ data } : { data: DatasetQuery | undefined }) {
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

  const [dataset, setDataset] = useState(pricesTransformed)


  return <table
      style={{
        minWidth: "100%"
      }}
    >
    <tr>
      <th>Price</th>
      <th>Hour</th>
      <th>Date</th>
      <th>Weekday</th>
    </tr>
    {
      dataset.map(({ date, price }) => {
        return <tr>
          <td>{Math.round(price*1000)/1000} DKK/KWh </td>
          <td>{date.toLocaleString("da-DK", { hour: 'numeric', minute: 'numeric' })}</td>
          <td>{date.toLocaleString("da-DK", { year: 'numeric', month: 'long', day: 'numeric', })}</td>
          <td>{date.toLocaleString("da-DK", { weekday: "long" })}</td>
        </tr>
      })
    }
  </table>
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
  const maxEntry = d3.max(dataset, (x) => x.price)
  const YMAX = Math.round(maxEntry ?? 0) + 1
  const BASELINE = YMAX

  const yaxis = d3.range(6)
  
  const scaleX = d3.scaleLinear()
    .domain([0, XMAX])
    .range([0, 10])

  let x = d3.scaleTime()
    .domain([dataset[0].date, dataset[dataset.length-1].date])
    .range([ 0, XMAX ])

  const stepCurve = dataset.reduce((prev, curr, idx) => {
    return `${prev},${BASELINE - curr.price} l ${scaleX(1)},0 L ${scaleX(idx+1)}`
  }, "M 0")

  return (
    <svg viewBox={`-1 -1 ${scaleX(XMAX)+2} ${YMAX+2}`} style={{height: "100vh"}}>
      <Baseline
        d={`M 0 ${BASELINE} L ${scaleX(XMAX+1)} ${BASELINE}`}
      />
      {
        yaxis.map(y => {
          return (
            <>
              <text
                x={0}
                y={BASELINE-y}
                font-size="0.006em"
                textAnchor="end"
                dominantBaseline="central"
                dx="-1em"
              >
                {`${y} DKK/KWh`}
              </text>
              <path
                d={`M 0 ${BASELINE-y} l ${scaleX(XMAX+1)} 0`}
                fill="none"
                stroke="hsl(0, 0%, 20%)"
                strokeWidth="var(--chart-divider-width)"
              />
            </>
          )
        })
      }
      <defs>
        <linearGradient
          id="Gradient1"
          x1={0}
          x2={0}
          y1={0}
          y2={1}
        >
          <stop offset="0%" stopColor="hsla(var(--color-hue-primary), 50%, 50%, 0.6)"/>
          <stop offset="100%" stopColor="hsla(var(--color-hue-primary), 50%, 50%, 0.1)"/>
        </linearGradient>
      </defs>
      {
        dataset.map(({date, price}) => {
          return (
            <>
              <path
                d={`M ${scaleX(x(date))} ${BASELINE-price} L ${scaleX(x(date))} ${BASELINE}`}
                fill="none"
                stroke="hsla(var(--color-hue-primary), 100%, 40%, 1)"
                strokeWidth="var(--chart-divider-width)"
              />
              <text
                x={scaleX(x(date))}
                y={BASELINE}
                font-size="0.006em"
                textAnchor="middle"
                dominantBaseline="hanging"
                dy="1em"
              >
                {`${date.toLocaleString("da-DK", { hour: "2-digit" })}h`}
              </text>
              <text
                x={scaleX(x(date))}
                y={BASELINE}
                font-size="0.006em"
                textAnchor="middle"
                dominantBaseline="hanging"
                dy="3em"
              >
                {`${date.toLocaleString("da-DK", { weekday: "short" })}`}
              </text>
              <text
                x={scaleX(x(date)+0.5)}
                y={BASELINE-price}
                font-size="0.006em"
                textAnchor="middle"
                fontWeight="bold"
                fill="hsl(var(--color-hue-primary), 100%, 30%)"
                dy="-2em"
              >
                {Math.round(price*100)/100}
              </text>
            </>
          )
        })
      }
      <path
        d={`${stepCurve} ${BASELINE} L ${0} ${BASELINE} z`}
        fill="url(#Gradient1)"
      />
      <path
        d={stepCurve}
        fill="none"
        stroke="hsla(var(--color-hue-primary), 100%, 40%, 1)"
        strokeWidth="var(--chart-border-width)"
      />
    </svg>
  )
}


const Baseline = styled.path`
  fill: none;
  stroke: hsl(0, 0%, 20%);
  stroke-width: var(--chart-border-width);
  stroke-linecap: round;
`

export default App
