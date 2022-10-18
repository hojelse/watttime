import type { NextPage } from 'next'
import { InterativeChart } from '../components/InteractiveChart'
import { MashData, MashType } from '../server-functions/MashData'

type Props = {
  mashData: MashType
}

const Home: NextPage<Props> = ({mashData}) => {

  // Revive dates
  const dataEntries =
    mashData.map(({HourDK, ...rest}) => ({
      date: new Date(HourDK),
      ...rest
    }))

  return (
    <>
      <div
        className="page"
        style={{
          width: "100vw",
          padding: "3em 0",
          backgroundColor: "var(--color-background)",
        }}
      >
        <InterativeChart data={dataEntries}/>
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


