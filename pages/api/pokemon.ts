import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  const file = path.join(process.cwd(), 'public/data', 'pokemon.json')
  const data = await fs.readFileSync(file, 'utf-8')
  const parsedJson = JSON.parse(data)

  const findByNumber = (id: number) =>
    parsedJson.find(pokemon => {
      return pokemon.id === id
    })

  if (!!req.query.id) {
    const id = req.query.id as string
    return res.status(200).json(findByNumber(parseInt(id)))
  }
}
