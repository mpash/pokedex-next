import cheerio from 'cheerio'
import fs from 'fs'
import { map, sortBy, uniq } from 'lodash/fp'
import { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'

// Scrapes the Pokedex from pokemon.com and returns a list of important data.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  const listOfPokemonSlugs = await getListOfPokemon()
  const data: {
    name: string
    number: string
    image?: string
    descriptionX: string
    descriptionY: string
  }[] = []

  await Promise.all(
    uniq(listOfPokemonSlugs).map(async pokemonSlug => {
      const url = `https://www.pokemon.com/us/pokedex/${pokemonSlug}`
      const html = await fetch(url).then(res => res.text())
      const $ = cheerio.load(html)

      const profileImages: string[] =
        $('.profile-images')
          .html()
          ?.trim()
          ?.trim()
          .split('\n')
          .map(i => i.trim())
          .filter(i => i !== '') ?? []

      if ($('#formes').children().length > 0) {
        $('#formes')
          .children()
          .map((i, el) => ({
            name: $(el).text(),
            number: $('.pokedex-pokemon-pagination-title')
              .text()
              .trim()
              .split('\n')[1]
              .trim(),
            descriptionX: $(
              `.version-descriptions:nth-child(${i + 1}) > .version-x`,
            )
              .html()
              ?.trim(),
            descriptionY: $(
              `.version-descriptions:nth-child(${i + 1}) > .version-y`,
            )
              .html()
              ?.trim(),
            image: $(profileImages[i]).attr('src'),
          }))
          .get()
          .forEach(item => {
            data.push(item)
          })
      } else {
        data.push({
          name: $('.pokedex-pokemon-pagination-title')
            .text()
            .trim()
            .split('\n')[0],
          number: $('.pokedex-pokemon-pagination-title')
            .text()
            .trim()
            .split('\n')[1]
            .trim(),
          descriptionX: $('.version-descriptions > .version-x').text().trim(),
          descriptionY: $('.version-descriptions > .version-y').text().trim(),
          image: $(profileImages[0]).attr('src'),
        })
      }
    }),
  )

  return res.status(200).json(sortBy('number', data))
}

const getListOfPokemon: () => Promise<string[]> = async () => {
  const file = path.join(process.cwd(), 'public/data', 'pokedex.json')
  const data = await fs.readFileSync(file, 'utf-8')
  const json = JSON.parse(data)
  return map('slug', json)
}
