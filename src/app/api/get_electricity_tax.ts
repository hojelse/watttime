export function getElectricityTax(date: Date) {
  if (date < new Date("2022-01-01T00:00:00")) return 0
  if (date < new Date("2022-06-01T00:00:00")) return 90.30 // source: www.elbiil.dk/opladning/aendring-i-elafgiften/
  if (date < new Date("2022-09-01T00:00:00")) return 76.30
  if (date < new Date("2023-01-01T00:00:00")) return 72.30
  if (date < new Date("2023-07-01T00:00:00")) return 0.80
  if (date < new Date("2024-01-01T00:00:00")) return 69.70
  if (date < new Date("2025-01-01T00:00:00")) return 71.00
  if (date < new Date("2026-01-01T00:00:00")) return 72.00 
  if (date < new Date("2028-01-01T00:00:00")) return 00.80 // source: https://skm.dk/media/fg2pvujk/faktaark-om-lempelse-af-elafgift.pdf
  return 0
}
