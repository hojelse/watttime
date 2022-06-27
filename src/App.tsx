import { useEffect, useState } from 'react'
import logo from './logo.svg'
import './App.css'
import type { DatasetQuery }  from '../graphql/generated'
import { GraphQLClient, gql } from 'graphql-request'

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
  const [blah, setBlah] = useState<DatasetQuery | undefined>(undefined)

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
      <div>
        {
          blah?.elspotprices[0].SpotPriceEUR
        }
      </div>
    </>
  )
}

export default App
