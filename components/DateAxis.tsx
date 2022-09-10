import { useMemo } from "react"
import * as d3 from 'd3'
import { NewChartSettings } from "../hooks/useChartDimensions"

type ArgType = {
  domain: Date[],
  range: number[],
  dms: NewChartSettings
}

export const DateAxis = ({ dms, domain, range }: ArgType) => {
  const ticks = useMemo(() => {
    const xScale = d3.scaleTime()
      .domain(domain)
      .range(range)
    const width = range[1] - range[0]
    const pixelsPerTick = 35
    const numberOfTicksTarget = Math.max(1, Math.floor(width / pixelsPerTick))

    return xScale.ticks(numberOfTicksTarget)
      .map(value => ({
        value,
        xOffset: xScale(value)
      }))
  }, [
    domain,
    range
  ])

  const first: Date = domain[0]
  const last: Date = domain[domain.length-1]
  const diffHours = Math.abs(last.valueOf() - first.valueOf()) / (60*60*1000);

  return (
    <g>
      {ticks.map(({ value, xOffset }) => (
        <g
          key={value.toISOString()}
          transform={`translate(${xOffset}, 0)`}
        >
          <line
            y1={-6}
            y2={dms.boundedHeight}
            stroke="var(--color-text-3)"
          />

          {
            (value.getDate() == 1)
            ? MonthText(value)
            : null
          }

          {
            (value.getHours() == 0)
            ? WeekDayText(value)
            : null
          }

          {HourText(value)}
        </g>
      ))}
    </g>
  )
}

function HourText(value: Date) {
  return <text
    key={"hour-" + value.toISOString()}
    fill="var(--color-text-2)"
    style={{
      fontSize: "10px",
      textAnchor: "middle",
      transform: "translateY(-12px)"
    }}
  >
    {hourFormat(value)}:
    {/* &apos; */}
  </text>
}

function hourFormat(date: Date) {
  return date.toLocaleString("en-UK", {
    hour: "2-digit",
    // minute: "2-digit",
    hour12: false,
  })
}

function WeekDayText(value: Date) {
  return <text
    key={"weekday-" + value.toISOString()}
    fill="var(--color-text-2)"
    style={{
      fontSize: "10px",
      textAnchor: "middle",
      transform: "translateY(-24px)"
    }}
  >
    {weekDayFormat(value)}
  </text>
}

function weekDayFormat(date: Date) {
  return date.toLocaleString("en-UK", {
    weekday: "short",
  })
}

function MonthText(value: Date) {
  return <text
    key={"month-" + value.toISOString()}
    fill="var(--color-text-2)"
    style={{
      fontSize: "10px",
      textAnchor: "middle",
      transform: "translateY(-36px)"
    }}
  >
    {monthFormat(value)}
  </text>
}

function monthFormat(date: Date) {
  return date.toLocaleString("en-UK", {
    month: "short",
    day: "numeric"
  })
}
