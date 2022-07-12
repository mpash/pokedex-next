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
  const scrapedData = await fs.readFileSync(scrapedFile, 'utf-8')
  const baseData = await fs.readFileSync(baseFile, 'utf-8')

  const scrapedJson = JSON.parse(scrapedData)
  const baseJson = JSON.parse(baseData)

  const findScrapedDataById = (id: number) => {
    return scrapedJson.filter(pokemon => {
      return normalizeId(pokemon.number) === id
    })
  }

  // map over baseJson and merge scraped data into it
  const mergedJson = baseJson.map(basePokemon => {
    const variants = findScrapedDataById(basePokemon.id) ?? []
    // add color palette to each pokemon
    // const colorPalette = variants.map(variant => {
    //   ColorThief.getColor(img)
    // })
    return {
      ...basePokemon,
      variants,
    }
  })

  return res.status(200).json(mergedJson)
}
