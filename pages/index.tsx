import type { NextPage } from 'next'
import { InterativeChart } from '../components/InteractiveChart'
import { MashData, MashType } from '../server-functions/MashData'

type Props = {
  mashData: MashType
}

export type MashTypeHydated = {
  date: Date
  marketPrice: number
  electricityTax: number
  netTarif: number
  vat: number
}[]

const Home: NextPage<Props> = ({mashData}) => {

  // Revive dates
  const dataEntries =
    mashData.map(({hour, ...rest}) => ({
      date: new Date(hour),
      ...rest
    }))

  return (
    <>
      <div
        className="page"
        style={{
          width: "100vw",
          backgroundColor: "var(--color-background)",
        }}
      >
        <InterativeChart dataEntries={dataEntries}/>
      </div>
     
    </>
  )
}

export async function getStaticProps() {

  const mashData = await MashData()

  return {
    props: { mashData },
    revalidate: 60*60
  }
}

export default Home


