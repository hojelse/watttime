import { NewChartSettings, useChartDimensions } from "../hooks/useChartDimensions";
import * as d3 from "d3";
import { useEffect, useMemo, useRef, useState } from "react";
import { DateAxis } from "./DateAxis";
import { DataEntries } from "../pages";
import { PriceAxis } from "./PriceAxis";

export type ChartSettings = {
  width?: number,
  height?: number,
  marginTop?: number,
  marginRight?: number,
  marginBottom?: number,
  marginLeft?: number,
}

const chartSettings: ChartSettings = {
  marginLeft: 30,
  marginRight: 30,
  marginTop: 10,
  marginBottom: 20
}

function myFormat(date: Date) {
  return date.toLocaleString("en-UK", localeFormat)
}

const localeFormat : Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  // second: '2-digit',
  hour12: false,
  timeZoneName: 'short'
}

export const InterativeChart = ({ data: passedData }: { data: DataEntries }) => {
  const [numHoursShown, setNumHoursShown] = useState(48)

  const boundArea = useRef<SVGRectElement>(null)

  const [ref, dms] = useChartDimensions(chartSettings)

  const data = useMemo(() => (
    passedData.slice().reverse()
  ), [passedData])

  const shownData = data.slice().splice(data.length - numHoursShown)

  const minPriceItem = shownData.reduce((prev, curr) => (prev.price < curr.price) ? prev : curr);
  const minPrice = minPriceItem.price
  const maxPriceItem = shownData.reduce((prev, curr) => (prev.price > curr.price) ? prev : curr);
  const maxPrice = maxPriceItem.price

  const minDate = shownData[0].date
  const maxDate = shownData[shownData.length-1].date

  const beginDate = addHours(1-numHoursShown, maxDate);

  const boundPadding = 40

  const yScale = useMemo(() => (
    d3.scaleLinear()
    .domain([Math.ceil(maxPrice/100)*100, Math.floor(minPrice/100)*100])
    .range([boundPadding, -boundPadding + dms.boundedHeight])
  ), [maxPrice, minPrice, dms])

  const xScale = useMemo(() => (
    d3.scaleTime()
    .domain([beginDate, addHours(1, maxDate)])
    .range([0, dms.boundedWidth])
  ), [maxDate, beginDate, dms])

  const [highlightOffset, setHighlightOffset] = useState<number | undefined>(undefined)
  const highlightTime = (highlightOffset) ? xScale.invert(highlightOffset) : undefined

  const setStuff = (e: PointerEvent) => {
    const rect = boundArea.current?.getBoundingClientRect()
    setHighlightOffset((rect) ? e.clientX - (rect.left) : undefined)
  }

  boundArea.current?.addEventListener("pointerdown", e => {
    boundArea.current?.setPointerCapture(e.pointerId)
    setStuff(e)

    boundArea.current?.addEventListener("pointermove", setStuff)
    boundArea.current?.addEventListener("pointerup", () => {
      setHighlightOffset(undefined)
      boundArea.current?.releasePointerCapture(e.pointerId)
      boundArea.current?.removeEventListener("pointermove", setStuff)
    }, {once: true})
  }, {once: true})

  const [currTime, setCurrTime] = useState(new Date())
  const currOffset = xScale(currTime)
  const refreshStuff = () => {
    setCurrTime(new Date())
  }

  useEffect(() => {
    const timerId = setInterval(refreshStuff, 1000);
    return function cleanup() {
      clearInterval(timerId);
    };
  }, [currTime]);

  return (<>
    <h3 style={{ color: "hsl(0, 0%, 0%)" }}>{myFormat(highlightTime ?? currTime)}</h3>
    <h1 style={{ color: "hsl(0, 0%, 0%)"}}>ØRE {Math.floor(findPrice(data, highlightTime ?? currTime) ?? 0)}</h1>
    <div
      style={{
        height: "100%",
        width: "100%",
        backgroundColor: "hsl(0, 0%, 97%)",
        touchAction: "none"
      }}
      ref={ref}
    >
      <svg width={dms.width} height={dms.height}>
        <defs>
            <clipPath id="clipPath">
                <rect x={0} y={0} width={dms.boundedWidth} height={dms.boundedHeight} />
            </clipPath>
        </defs>
        <g
          transform={`translate(${[
            dms.marginLeft,
            dms.marginTop
          ].join(",")})`}
          clipPath="url(#clipPath)"
        >
          <rect
            ref={boundArea}
            width={dms.boundedWidth}
            height={dms.boundedHeight}
            fill="hsl(0, 0%, 95%)"
          />
          <MinText xScale={xScale} yScale={yScale} minPriceItem={minPriceItem} />
          <MaxText xScale={xScale} yScale={yScale} maxPriceItem={maxPriceItem} />
          <StepCurve xScale={xScale} yScale={yScale} data={data} />
          <line
            stroke="hsl(0, 0%, 0%)"
            x1={highlightOffset ?? currOffset} y1={0}
            x2={highlightOffset ?? currOffset} y2={dms.boundedHeight}
            strokeDasharray="10 5"
            strokeWidth={1}
          />
          <circle
            cx={highlightOffset ?? currOffset}
            cy={yScale(findPrice(data, highlightTime ?? currTime) ?? 0)}
            r={5}
            stroke="black"
            strokeWidth={2}
            fill="hsl(0, 0%, 100%)"
          />
        </g>
        <XAxis xScale={xScale} dms={dms} />
        <YAxis yScale={yScale} dms={dms} />
      </svg>
    </div>
    <input
      type="radio"
      name="timeScale"
      id="timeScale-36H"
      value={36}
      checked={numHoursShown === 36}
      onChange={e => setNumHoursShown(36)}
    />
    <label htmlFor="timeScale-36H">36H</label>
    <input type="radio"
      name="timeScale"
      id="timeScale-48H"
      value={48}
      checked={numHoursShown === 48}
      onChange={e => setNumHoursShown(48)}
    />
    <label htmlFor="timeScale-48H">48H</label>
    <input type="radio"
      name="timeScale"
      id="timeScale-1W"
      value={24*7}
      checked={numHoursShown === 24*7}
      onChange={e => setNumHoursShown(24*7)}
    />
    <label htmlFor="timeScale-1W">1W</label>
    <input type="radio"
      name="timeScale"
      id="timeScale-1M"
      value={24*30}
      checked={numHoursShown === 24*30}
      onChange={e => setNumHoursShown(24*30)}
    />
    <label htmlFor="timeScale-1M">1M</label>
  </>)
}

function findPrice(
  data: DataEntries,
  date: Date
) {
  const dateFloor = date
  dateFloor.setMinutes(0, 0, 0)

  const dateCeil = addHours(1, dateFloor)

  
  for (let i = 0; i < data.length; i++) {
    const el = data[i];
    if (dateFloor <= el.date && el.date <= dateCeil) {
        return el.price
    }
  }
  return null
}

type TypeXScale = d3.ScaleTime<number, number, never>
type TypeYScale = d3.ScaleLinear<number, number, never>
type Data = {date: Date, price: number}[]

function XAxis({dms, xScale}: {dms: NewChartSettings, xScale: TypeXScale}) {
  return (
    <g transform={`translate(${[
      dms.marginLeft,
      dms.marginTop + dms.boundedHeight,
    ].join(",")})`}>
      <DateAxis
        dms={dms}
        domain={xScale.domain()}
        range={xScale.range()} />
    </g>
  )
}

function YAxis({dms, yScale}: {dms: NewChartSettings, yScale: TypeYScale}) {
  return (
    <g transform={`translate(${[
      dms.marginLeft + dms.boundedWidth,
      dms.marginTop
    ].join(",")})`}>
      <PriceAxis
        dms={dms}
        domain={yScale.domain()}
        range={yScale.range()} />
    </g>
  )
}

function MinText({ xScale, yScale, minPriceItem }: { xScale: TypeXScale, minPriceItem: { date: Date; price: number; }, yScale: TypeYScale }) {
  return (
    <text
      style={{
        transform: "translateY(20px)",
        fontSize: "1rem",
        textAnchor: "middle",
        dominantBaseline: "hanging",
        fill: "hsl(0, 0%, 0%)"
      }}
      x={xScale(minPriceItem.date)}
      y={yScale(minPriceItem.price)}
    >
      {`ØRE ${Math.floor(minPriceItem.price)}`}
    </text>
  )
}

function MaxText({ xScale, yScale, maxPriceItem }: { xScale: TypeXScale, maxPriceItem: { date: Date; price: number; }, yScale: TypeYScale }) {
  return <text
    style={{
      transform: "translateY(-20px)",
      fontSize: "1rem",
      textAnchor: "middle",
      fill: "hsl(0, 0%, 0%)"
    }}
    x={xScale(maxPriceItem.date)}
    y={yScale(maxPriceItem.price)}
  >
    {`ØRE ${Math.floor(maxPriceItem.price)}`}
  </text>;
}

function StepGradient({ data, xScale, yScale }: { data: Data, xScale: TypeXScale, yScale: TypeYScale}) {
  const stepCurve = createStepCurve(data, xScale, yScale)

  const closedStepCurve = stepCurve + " " + [
    "V", yScale(0),
    "H", xScale(data[0].date),
    "Z"
  ].join(" ")

  return (
    <>
      <path
        d={closedStepCurve}
        fill="url(#Gradient1)"
        mask="url(#fade)"
      />
      <defs>
        <linearGradient id="Gradient1">
          <stop offset="0%"   stopColor="hsl(250,72%,27%)" />
          <stop offset="20%"  stopColor="hsl(252,75%,32%)" />
          <stop offset="30%"  stopColor="hsl(260,89%,40%)" />
          <stop offset="50%"  stopColor="hsl(277,85%,45%)" />
          <stop offset="70%"  stopColor="hsl(294,75%,45%)" />
          <stop offset="80%"  stopColor="hsl(327,55%,62%)" />
          <stop offset="100%" stopColor="hsl(307,41%,68%)" />
        </linearGradient>
        <linearGradient id="fadeGrad" y2="1" x2="0">
          <stop offset="0%" stopColor="white" stopOpacity="1"/>
          <stop offset="100%" stopColor="white" stopOpacity="0"/>
        </linearGradient>
        <mask id="fade" maskContentUnits="objectBoundingBox">
          <rect width="1" height="1" fill="url(#fadeGrad)"/>
        </mask>
      </defs>
    </>
  )
}

function StepCurve({ data, xScale, yScale }: { data: Data, xScale: TypeXScale, yScale: TypeYScale}) {

  const stepCurve = createStepCurve(data, xScale, yScale)

  return (
    <path
      d={stepCurve}
      fill="none"
      stroke="hsl(0, 0%, 0%)"
      strokeWidth={2}
      strokeLinecap="round"
    />
  )
}

function createStepCurve(data: Data, xScale: TypeXScale, yScale: TypeYScale) {
  const head = data.slice().splice(0, 1)[0]
  
  const start = ["M", xScale(head.date), yScale(head.price), "H", xScale(addHours(1, head.date))].join(" ")
  const mid = data.map(({date, price}) => {
    return ["L", xScale(date), yScale(price), "H", xScale(addHours(1, date))].join(" ")
  })
  return start + " " + mid.join(" ")
}

function addHours(numOfHours: number, date: Date) {
  const newDate = new Date(date)
  newDate.setTime(newDate.getTime() + numOfHours * 60 * 60 * 1000);
  return newDate;
}

function roundDecimal(num: number, decimals: number) {
  const factor = Math.pow(10, decimals)
  return Math.round(num * factor) / factor
}
