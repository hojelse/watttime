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
    const pixelsPerTick = 20
    const numberOfTicksTarget = Math.max(1, Math.floor(width / pixelsPerTick))

    return xScale.ticks(numberOfTicksTarget)
      .map(value => ({
        value,
        xOffset: xScale(value)
      }))
  }, [
    domain.map(x => x.toISOString()).join("-"),
    range.join("-")
  ])

  return (
    <g>
      {ticks.map(({ value, xOffset }) => (
        <g
          key={value.toISOString()}
          transform={`translate(${xOffset}, 0)`}
        >
          <line
            y1={-dms.boundedHeight}
            y2="6"
            stroke="hsla(0, 0%, 0%, 0.1)"
          />
          <text
            key={value.toISOString()}
            style={{
              fontSize: "10px",
              textAnchor: "middle",
              transform: "translateY(20px)"
            }}>
            { hourFormat(value) || 24 }
          </text>
        </g>
      ))}
    </g>
  )
}

function hourFormat(date: Date) {
  return date.toLocaleString("en-UK", {
    hour: '2-digit',
    hour12: false,
  })
}
