// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { MashData } from '../../server-functions/MashData'

export default async function handler(
  req: NextApiRequest,
  // res: NextApiResponse<Awaited<ReturnType<typeof MashData>>>
  res: NextApiResponse<string>
) {
  const pricesTransformed = await MashData()
  // Stupid shit to console.table() in browser
  res.status(200)
    .setHeader("Content-Type", "text/html")
    .send(`look in console :) <script>console.table(JSON.parse(\`${JSON.stringify(pricesTransformed)}\`))</script>`)
}
