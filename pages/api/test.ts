import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

const normalizeId = (number: Pokemon['number']) => {
  return parseInt(number.split('#')[1])
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  const scrapedFile = path.join(
    process.cwd(),
    'public/data',
    'pokedex-scrape.json',
  )
  const baseFile = path.join(process.cwd(), 'public/data', 'pokedex.json')
  const jpFile = path.join(process.cwd(), 'public/data', 'pokedex-jp.json')
  const scrapedData = await fs.readFileSync(scrapedFile, 'utf-8')
  const baseData = await fs.readFileSync(baseFile, 'utf-8')
  const jpData = await fs.readFileSync(jpFile, 'utf-8')

  const scrapedJson = JSON.parse(scrapedData)
  const baseJson = JSON.parse(baseData)
  const jpJson = JSON.parse(jpData)

  const findScrapedDataById = (id: number) => {
    return scrapedJson.filter(pokemon => {
      return normalizeId(pokemon.number) === id
    })
  }

  const findJapaneseVariants = (number: Pokemon['number']) => jpJson.filter(pokemon => {
    return pokemon.no === number
  })

  // map over baseJson and merge scraped data into it
  const mergedJson = baseJson.map(basePokemon => {
    const variants = findScrapedDataById(basePokemon.id) ?? []
    const japaneseVariants = findJapaneseVariants(basePokemon.number)
    return {
      ...basePokemon,
      variants,
      japaneseVariants,
    }
  })

  return res.status(200).json(mergedJson)
}
