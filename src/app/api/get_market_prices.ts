export async function getMarketPrices() {
  const hourCount = 24 * 30 * 12

  const res = await fetch(
      `https://api.energidataservice.dk/dataset/DayAheadPrices?limit=${hourCount}&offset=0&timezone=utc+1&filter={"PriceArea":"DK2"}`,
      { next: { revalidate: 60 * 60 } }
    );
  const data = (await res.json()) as DayAheadPrices

  const prices = data.records.map(
    ({ TimeUTC, DayAheadPriceEUR }) => {
      const spotPriceEur = DayAheadPriceEUR
      const eurToDkk = 7.45
      const dkkToOre = 100
      const mwtToKwt = 0.001
      const orePrKwt = spotPriceEur * mwtToKwt * eurToDkk * dkkToOre

      return {
        date: new Date(TimeUTC),
        orePrKwt: orePrKwt,
      }
    }
  )
  return prices
}

export type DayAheadPrices = {
  dataset: string,
  records: {
    TimeDK: string
    TimeUTC: string
    PriceArea: string
    DayAheadPriceDKK: number
    DayAheadPriceEUR: number
  }[];
};
