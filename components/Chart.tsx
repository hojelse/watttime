import * as d3 from 'd3'
import { useEffect, useState } from 'react'
import { DataEntries } from '../pages/index'
import styled from 'styled-components'

export function Chart({ data }: { data: DataEntries }) {

  const [dataset, setDataset] = useState<DataEntries>()

  const currentDate = new Date()
  currentDate.setHours(new Date().getHours() - 1)
  
  useEffect(() => {
    const data2 = data
      // .filter(x => currentDate < x.date)
      .slice(undefined, 36)
      .slice().reverse()
    setDataset(data2)
  }, [])

  if (dataset === undefined)
    return null

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

  return <>
    <Canvas viewBox={`-0.5 -0.5 ${X(XMAX)+1} ${Y(YMAX)+1}`} >
      {
        yaxis.map(y => {
          return (y % 100 == 0)
          ? (<>
            <Price x={0} y={BASELINE-Y(y)} dominant-baseline="central" dx="-0.2" >
              {`${y}`}
            </Price>
            <ChartDividerY d={`M 0 ${BASELINE-Y(y)} l ${X(XMAX+1)} 0`} />
          </>)
          : null
        })
      }
      {
        dataset.map(({date, price, isFuture}, idx) => {
          const before = dataset[idx-1]?.price
          const after = dataset[idx+1]?.price
          const isStart = (idx == 0)
          const isEnd = (idx == dataset.length-1)
          const isLocalMax = (before < price && price > after) || (isEnd && before < price)
          const isLocalMin = (before > price && price < after) || (isEnd && before > price)
          const isLocalM = isLocalMax || isLocalMin
          const isHour00 = date.getHours() == 0
          return <g key={`g-${date.toISOString()}`}>
            <ChartDividerX
              isFuture={isFuture}
              d={`M ${X(x(date))} ${BASELINE-Y(price)} L ${X(x(date))} ${BASELINE}`}
            />
            {
              <Gradient
                isFuture={isFuture}
                d={`M ${X(x(date))} ${BASELINE-Y(price)} L ${X(x(date))} ${BASELINE} L ${X(x(date)+1)} ${BASELINE} L ${X(x(date)+1)} ${BASELINE-Y(price)} z`}
              />
            }
            <DateHour x={X(x(date)+0.5)} y={BASELINE} dominant-baseline="hanging" dy="0.1" >
              {`${date.toLocaleString("da-DK", { hour: "2-digit" })}`}
            </DateHour>
            {
              (isHour00 || isStart)
              ? <DateWeekday x={X(x(date))} y={BASELINE} dominant-baseline="hanging" dy="0.3" >
                  {`${date.toLocaleString("da-DK", { weekday: "long" })}`}
                </DateWeekday>
              : null
            }
            {
              (isLocalM || isEnd)
              ? <ColumnText x={X(x(date)+0.5)} y={BASELINE-Y(price)} dy="-0.2" isFuture={isFuture}>
                  {Math.round(price*100)/100}
                </ColumnText>
              : null
            }
          </g>
        })
      }
      {/* <Gradient d={`${stepCurve} ${BASELINE} L ${0} ${BASELINE} z`} /> */}
      <Baseline d={`M 0 ${BASELINE} L ${X(XMAX+1)} ${BASELINE}`} />
      <defs>
        <linearGradient id="Gradient1" x1={0} x2={0} y1={0} y2={1} >
          <stop offset="0%" stopColor={`hsla(var(--color-hue-primary), 50%, 50%, 0.6)`}/>
          <stop offset="100%" stopColor="hsla(var(--color-hue-primary), 50%, 50%, 0.1)"/>
        </linearGradient>
        <linearGradient id="Gradient2" x1={0} x2={0} y1={0} y2={1} >
          <stop offset="0%" stopColor={`hsla(0, 0%, 0%, 0.6)`}/>
          <stop offset="100%" stopColor="hsla(0, 0%, 0%, 0.1)"/>
        </linearGradient>
      </defs>
    </Canvas>
  </>

  function createStepCurve() {
    return dataset?.reduce((prev, curr, idx) => {
      return `${prev},${BASELINE - Y(curr.price)} l ${X(1)},0 L ${X(idx + 1)}`
    }, "M 0")
  }
}

const Canvas = styled.svg`
  width: 100vw;
  max-height: 100vw;
  max-height: 100vh;
`

const Gradient = styled.path<{isFuture: boolean}>`
  fill: ${props => props.isFuture ? "url(#Gradient1)" : "url(#Gradient2)"}
`

const ChartDividerY = styled.path`
  fill: none;
  stroke: var(--color-foreground);
  stroke-width: var(--chart-divider-width);
  stroke-linecap: round;
`
const ChartDividerX = styled.path<{isFuture: boolean}>`
  fill: none;
  stroke: hsla(var(--color-hue-primary), ${props => props.isFuture ? "100%" : "0%"}, 40%, 1);
  stroke-width: var(--chart-divider-width);
  stroke-linecap: round;
`

const Price = styled.text`
  fill: var(--color-foreground);
  text-anchor: end;
  font-size: 0.006em;
`

const DateHour = styled.text`
  fill: var(--color-foreground);
  text-anchor: middle;
  font-size: 0.006em;
`

const DateWeekday = styled.text`
  fill: var(--color-foreground);
  text-anchor: start;
  font-size: 0.006em;
`

const ColumnText = styled.text<{isFuture: boolean}>`
  font-size: 0.006em;
  text-anchor: middle;
  font-weight: 500;
  fill: hsl(var(--color-hue-primary), ${props => props.isFuture ? "100%" : "0%"}, 30%);
`

const Stepcurve = styled.path`
  fill: none;
  stroke-width: var(--chart-border-width);
  stroke-linecap: round;
`

const Baseline = styled.path`
  fill: none;
  stroke: var(--color-foreground);
  stroke-width: var(--chart-border-width);
  stroke-linecap: round;
`