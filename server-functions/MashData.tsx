
export type MashType = {
  hour: string
  marketPrice: number
  electricityTax: number
  netTarif: number
  vat: number
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
  const marketPrices = await getMarketPrice()

  const tarifs: any = await getNetTarifs()

  const firstOrDefault = (currDate: Date, tarifs: any) => {
    for (let i = 0; i < tarifs.length; i++) {
      const tarif = tarifs[i];
      if (tarif.from <= currDate && currDate <= tarif.to)
        return tarif.hours[currDate.getHours()] * 100
    }
    return 0
  }

  // Apply nettarifs
  return marketPrices.map(({HourDK, price}) => {
    const currDate = new Date(HourDK)
    const netTarif = firstOrDefault(currDate, tarifs)

    const vat = 1.25
    const electricityTax = 76.3

    return {
      hour: HourDK,
      marketPrice: price,
      electricityTax,
      netTarif,
      vat
    }
  })
}

async function getMarketPrice() {
  const hourCount = 24 * 30 * 12
  const res = await fetch(`https://api.energidataservice.dk/dataset/Elspotprices?limit=${hourCount}&offset=0&sort=HourUTC DESC&timezone=utc+1&filter={"PriceArea":"DK2"}`)
  const data = (await res.json()) as ElspotType

  const prices = data.records

  const currentDate = new Date()
  currentDate.setHours(new Date().getHours() - 1)

  const pricesTransformed = prices.map(
    ({ HourDK, SpotPriceEUR }) => {

      return {
        HourDK: HourDK,
        price: rawPrice_OrePrKwt(SpotPriceEUR)
      }
    }
  )
  return pricesTransformed
}

export function rawPrice_OrePrKwt(SpotPriceEUR: any) {
  const priceEur = SpotPriceEUR as number
  const eurToDkk = 7.45
  const DkkToOre = 100
  const mwtToKwt = 0.001
  const price = priceEur * mwtToKwt * eurToDkk * DkkToOre
  return price
}

async function getNetTarifs() {
  const tarifRes = await fetch(`https://api.energidataservice.dk/dataset/DatahubPricelist?offset=0&filter=%7B%22ChargeOwner%22:%22Radius%20Elnet%20A/S%22,%22ChargeTypeCode%22:%22DT_C_01%22%7D&sort=ValidFrom%20DESC&timezone=dk`)

  const tarifData = await tarifRes.json()
  const recs = tarifData.records

  const tarifs: any = []

  recs.forEach((rec: any) => {
    const tarifHours: any = {}

    const from = new Date(rec.ValidFrom)
    const to = new Date(rec.ValidTo)

    tarifHours["from"] = from
    tarifHours["to"] = to

    tarifHours["hours"] = []
    for (let i = 1; i <= 24; i++) {
      const key = `Price${i}`
      tarifHours["hours"].push(rec[key])
    }

    tarifs.push(tarifHours)
  });
  
  return tarifs
}
