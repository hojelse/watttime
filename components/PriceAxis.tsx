import { useMemo } from "react"
import * as d3 from 'd3'
import { NewChartSettings } from "../hooks/useChartDimensions"

type ArgType = {
  domain: number[],
  range: number[],
  dms: NewChartSettings
}

export const PriceAxis = ({ dms, domain, range }: ArgType) => {
  const ticks = useMemo(() => {
    const yScale = d3.scaleLinear()
      .domain(domain)
      .range(range)
    const width = range[1] - range[0]
    const pixelsPerTick = 30
    const numberOfTicksTarget = Math.max(1, Math.floor(width / pixelsPerTick))

    return yScale.ticks(numberOfTicksTarget)
      .map(value => ({
        value,
        yOffset: yScale(value)
      }))
  }, [domain.join("-"), range.join("-")])

  return (
    <g>
      {ticks.map(({ value, yOffset }) => (
        <g
          key={value}
          transform={`translate(0, ${yOffset})`}
        >
          <line
            x1={-dms.boundedWidth}
            x2="6"
            stroke="hsla(0, 0%, 0%, 0.1)"
          />
          <text
            key={value}
            style={{
              fontSize: "10px",
              textAnchor: "middle",
              dominantBaseline: "central",
              transform: "translateX(20px)"
            }}>
            { value }
          </text>
        </g>
      ))}
    </g>
  )
}