
export type MashType = {
  HourDK: string
  price: number,
  rawPrice: number
}[]

export type ElspotType = {
  dataset: string,
  records: {
    HourDK: string
    HourUTC: string
    PriceArea: string
    SpotPriceDKK: number
    SpotPriceEUR: number
  }[]
}

export async function MashData(): Promise<MashType> {
  const hourCount = 24 * 30
  const res = await fetch(`https://api.energidataservice.dk/dataset/Elspotprices?limit=${hourCount}&offset=0&sort=HourUTC DESC&timezone=utc+1&filter={"PriceArea":"DK2"}`)
  const data = (await res.json()) as ElspotType

  const prices = data.records

  const currentDate = new Date()
  currentDate.setHours(new Date().getHours() - 1)

  const pricesTransformed = prices.map(
    ({ HourDK, SpotPriceEUR }) => {

      return {
        HourDK: HourDK,
        price: tranformPrice(SpotPriceEUR)
      }
    }
  )

  const tarifRes = await fetch(`https://api.energidataservice.dk/dataset/DatahubPricelist?offset=0&start=2022-10-01T00:00&end=2022-10-02T00:00&filter=%7B%22ChargeOwner%22:%22Radius%20Elnet%20A/S%22,%22ChargeTypeCode%22:%22DT_C_01%22%7D&sort=ValidFrom%20DESC&timezone=dk`)

  const tarifData = await tarifRes.json()
  const firstTarif = tarifData.records[0]

  console.dir(firstTarif)


  const tarifHours: any = {}

  tarifHours["from"] = new Date(firstTarif.ValidFrom)
  tarifHours["to"] = new Date(firstTarif.ValidTo)

  tarifHours["hours"] = []
  for (let i = 1; i <= 24; i++) {
    const key = `Price${i}`
    tarifHours["hours"].push(firstTarif[key])
  }

  const withTarifs = pricesTransformed.map(({HourDK, price}) => {
    const currDate = new Date(HourDK)
    
    const tarif = (tarifHours.from <= currDate && currDate <= tarifHours.to)
      ? tarifHours.hours[currDate.getHours()] * 100
      : 0

    return {
      HourDK,
      price: price+tarif,
      rawPrice: price
    }
  })

  return withTarifs
}

export function tranformPrice(SpotPriceEUR: any) {
  const priceEur = SpotPriceEUR as number
  const moms = 1.25
  const eurToDkk = 7.5
  const mwtToKwt = 0.001
  const price = priceEur * moms * eurToDkk * mwtToKwt * 100
  return price
}
