import { useEffect, useState } from 'react'
import { DataEntries } from '../pages/index'

export function Table({ data }: { data: DataEntries }) {

  const [dataset, setDataset] = useState<DataEntries | undefined>(undefined)

  useEffect(() => {
    setDataset(data)
  }, [])

  if (dataset == undefined)
    return null

  return <table
    style={{
      minWidth: "100vw"
    }}
  >
    <thead>
      <tr>
        <th>Price</th>
        <th>Hour</th>
        <th>Date</th>
        <th>Weekday</th>
      </tr>
    </thead>
    <tbody>
      {
        dataset.map(({ date, price }) => {
          return <tr key={`tr-${date.toISOString()}`}>
            <td>{Math.round(price * 1000) / 1000} DKK/KWh </td>
            <td>{date.toLocaleString("da-DK", { hour: 'numeric', minute: 'numeric' })}</td>
            <td>{date.toLocaleString("da-DK", { year: 'numeric', month: 'long', day: 'numeric', })}</td>
            <td>{date.toLocaleString("da-DK", { weekday: "long" })}</td>
          </tr>
        })
      }
    </tbody>
  </table>
}
