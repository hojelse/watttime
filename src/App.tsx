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
    limit: 33
    offset: 0
  )
  {HourUTC HourDK PriceArea SpotPriceDKK SpotPriceEUR }
}
`

function App() {
  const [dataset, setDataset] = useState<DatasetQuery | undefined>(undefined)
  const [lastFetchTime, setLastFetchTime] = useState<Date | undefined>(undefined)

  useEffect(() => {
    const loader = async () => {  
      const githubapi = new GraphQLClient(
        "https://data-api.energidataservice.dk/v1/graphql"
      )
    
      const resp = await githubapi.request(GetDataset)
    
      return resp as DatasetQuery
    }

    loader().then(x => {
      setDataset(x)
      setLastFetchTime(new Date())
    })
  }, [])

  return (
    <>
      <Chart data={dataset}/>
      <p>Time of last data fetch: {lastFetchTime != undefined ? lastFetchTime.toUTCString() : "No data yet"}</p>
      <Table data={dataset}/>
    </>
  )
}

export function Table({ data } : { data: DatasetQuery | undefined }) {
  if (data == undefined) return null

  var prices = data.elspotprices

  const pricesTransformed = prices.map(
    ({HourDK, SpotPriceEUR}) => {

    return {
      date: new Date(HourDK),
      price: tranformPrice(SpotPriceEUR)
    }
  })

  const [dataset, setDataset] = useState(pricesTransformed)


  return <table
      style={{
        minWidth: "100vw"
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
  const transformedPrices = transformPrices()
 
  const [dataset, setDataset] = useState(transformedPrices)

  const CANVAS_WIDTH = 5
  const CANVAS_HEIGHT = 5

  const XMAX = dataset.length-1
  const maxPrice = d3.max(dataset, (x) => x.price)
  const YMAX = Math.round(maxPrice ?? 0) + 1

  const yaxis = d3.range(1, YMAX+1)
  
  const X = d3.scaleLinear()
    .domain([0, XMAX])
    .range([0, CANVAS_WIDTH])

  const x = d3.scaleTime()
    .domain([dataset[0].date, dataset[dataset.length-1].date])
    .range([ 0, XMAX ])

  const Y = d3.scaleLinear()
    .domain([0, YMAX])
    .range([0, CANVAS_HEIGHT])

  const BASELINE = Y(YMAX)


  const stepCurve = createStepCurve()

  return <>
    <Canvas viewBox={`-0.5 -0.5 ${X(XMAX)+1} ${Y(YMAX)+1}`} >
      {
        yaxis.map(y => {
          return <>
              <Price x={0} y={BASELINE-Y(y)} dx="-0.2" >
                {`${y}`}
              </Price>
              <ChartDividerY d={`M 0 ${BASELINE-Y(y)} l ${X(XMAX+1)} 0`} />
          </>
        })
      }
      {
        dataset.map(({date, price}, idx) => {
          const before = dataset[idx-1]?.price
          const after = dataset[idx+1]?.price
          const isStart = (idx == 0)
          const isEnd = (idx == dataset.length-1)
          const isLocalMax = (before < price && price > after) || (isEnd && before < price)
          const isLocalMin = (before > price && price < after) || (isEnd && before > price)
          const isLocalM = isLocalMax || isLocalMin
          const is00 = date.getHours() == 0
          return <>
            <ChartDividerX
              d={`M ${X(x(date))} ${BASELINE-Y(price)} L ${X(x(date))} ${BASELINE}`}
            />
            {
              (isLocalMin)
              ? <path
                  d={`M ${X(x(date))},${BASELINE-Y(price)} L${X(x(date)+1)},${BASELINE-Y(price)} L${X(x(date)+1)},${BASELINE} L${X(x(date))},${BASELINE}`}
                  fill="hsla(var(--color-hue-primary), 50%, 80%, 0.9)"
                />
              : null
            }
            <DateHour x={X(x(date)+0.5)} y={BASELINE} dy="0.1" >
              {`${date.toLocaleString("da-DK", { hour: "2-digit" })}`}
            </DateHour>
            {
              (is00 || isStart)
              ? <DateWeekday x={X(x(date))} y={BASELINE} dy="0.3" >
                  {`${date.toLocaleString("da-DK", { weekday: "long" })}`}
                </DateWeekday>
              : null
            }
            {
              (isLocalM || isEnd)
              ? <ColumnText x={X(x(date)+0.5)} y={BASELINE-Y(price)} dy="-0.2" >
                  {Math.round(price*100)/100}
                </ColumnText>
              : null
            }
          </>
        })
      }
      <Gradient d={`${stepCurve} ${BASELINE} L ${0} ${BASELINE} z`} />
      <Stepcurve d={stepCurve} />
      <Baseline d={`M 0 ${BASELINE} L ${X(XMAX+1)} ${BASELINE}`} />
      <defs>
        <linearGradient id="Gradient1" x1={0} x2={0} y1={0} y2={1} >
          <stop offset="0%" stopColor="hsla(var(--color-hue-primary), 50%, 50%, 0.6)"/>
          <stop offset="100%" stopColor="hsla(var(--color-hue-primary), 50%, 50%, 0.1)"/>
        </linearGradient>
      </defs>
    </Canvas>
  </>

  function transformPrices() {
    return prices.map(
      ({ HourDK, SpotPriceEUR }) => {
        return {
          date: new Date(HourDK),
          price: tranformPrice(SpotPriceEUR)
        }
      })
      .reverse()
  }

  function createStepCurve() {
    return dataset.reduce((prev, curr, idx) => {
      return `${prev},${BASELINE - Y(curr.price)} l ${X(1)},0 L ${X(idx + 1)}`
    }, "M 0")
  }
}

const Canvas = styled.svg`
  width: 100vw;
  max-height: 100vw;
  max-height: 100vh;
`

const Gradient = styled.path`
  fill: url(#Gradient1);
`

const ChartDividerY = styled.path`
  fill: none;
  stroke: var(--color-foreground);
  stroke-width: var(--chart-divider-width);
  stroke-linecap: round;
`
const ChartDividerX = styled.path`
  fill: none;
  stroke: hsla(var(--color-hue-primary), 100%, 40%, 1);
  stroke-width: var(--chart-divider-width);
  stroke-linecap: round;
`

const Price = styled.text`
  fill: var(--color-foreground);
  text-anchor: end;
  dominant-baseline: central;
  font-size: 0.006em;
`

const DateHour = styled.text`
  fill: var(--color-foreground);
  text-anchor: middle;
  dominant-baseline: hanging;
  font-size: 0.006em;
`

const DateWeekday = styled.text`
  fill: var(--color-foreground);
  text-anchor: start;
  dominant-baseline: hanging;
  font-size: 0.006em;
`

const ColumnText = styled.text`
  font-size: 0.006em;
  text-anchor: middle;
  font-weight: 500;
  fill: hsl(var(--color-hue-primary), 100%, 30%);
`

const Stepcurve = styled.path`
  fill: none;
  stroke: hsla(var(--color-hue-primary), 100%, 40%, 1);
  stroke-width: var(--chart-border-width);
  stroke-linecap: round;
`

const Baseline = styled.path`
  fill: none;
  stroke: var(--color-foreground);
  stroke-width: var(--chart-border-width);
  stroke-linecap: round;
`

export default App

function tranformPrice(SpotPriceEUR: any) {
  const priceEur = SpotPriceEUR as number
  const moms = 1.25
  const eurToDkk = 7.5
  const mwtToKwt = 0.001
  const price = priceEur * moms * eurToDkk * mwtToKwt
  return price
}