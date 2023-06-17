import cheerio from 'cheerio'
import fs from 'fs/promises'
import { map, sortBy, uniq } from 'lodash/fp'
import { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'

type PokemonWithDescription = {
  name: string
  number: string
  image?: string
  slug?: string
  subVariant: number
  descriptionX: string
  descriptionY: string
}

/**
 * Fetches a pokemon by slug from pokemon.com and retries up to 3 times if the request fails.
 * @param slug Pokemon slug
 * @param attempt Current attempt
 * @returns HTML Pokemon Details
 */
const fetchPokemonBySlug = async (slug: string, attempt = 1) => {
  const url = `https://www.pokemon.com/us/pokedex/${slug}`
  const res = await fetch(url)

  if (!res.ok) {
    if (attempt > 3) {
      throw new Error(`Error fetching ${url}`)
    }
    await new Promise(resolve => setTimeout(resolve, 1000))
    return fetchPokemonBySlug(slug, attempt + 1)
  }

  return res
}

// Scrapes the Pokedex from pokemon.com and returns a list of important data.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  const uniqPokemonSlugs = await getUniqPokemonSlugs()
  const data: PokemonWithDescription[] = []

  await Promise.all(
    uniqPokemonSlugs.map(async pokemonSlug => {
      const res = await fetchPokemonBySlug(pokemonSlug)
      const html = await res.text()
      const $ = cheerio.load(html)

      const trimHtml = (selector: string) => $(selector).text().trim()

      const profileImages: string[] =
        $('.profile-images')
          .html()
          ?.trim()
          ?.trim()
          .split('\n')
          .map(i => i.trim())
          .filter(i => i !== '') ?? []

      const formes = $('#formes').children()

      const pokemonNumber = trimHtml(
        '.pokedex-pokemon-pagination-title .pokemon-number',
      )

      if (formes.length > 0) {
        formes
          .map(
            (i, el) =>
              ({
                name: $(el).text().trim(),
                number: pokemonNumber,
                slug: pokemonSlug,
                subVariant: i,
                descriptionX: trimHtml(
                  `.version-descriptions:nth-child(${i + 1}) > .version-x`,
                ),
                descriptionY: trimHtml(
                  `.version-descriptions:nth-child(${i + 1}) > .version-y`,
                ),
                image: $(profileImages[i]).attr('src'),
              } as PokemonWithDescription),
          )
          .get()
          .forEach(item => {
            data.push(item)
          })
      } else {
        data.push({
          name: trimHtml('.pokedex-pokemon-pagination-title > div').split(
            '\n',
          )[0],
          number: pokemonNumber,
          subVariant: 0,
          slug: pokemonSlug,
          descriptionX: trimHtml('.version-descriptions > .version-x'),
          descriptionY: trimHtml('.version-descriptions > .version-y'),
          image: $(profileImages[0]).attr('src'),
        })
      }
    }),
  )

  const result = sortBy('number', data).map(pokemon => ({
    ...pokemon,
    number: pokemon.number.replace('#', ''),
  }))

  return res.status(200).json(result)
}

const getUniqPokemonSlugs: () => Promise<string[]> = async () => {
  // fetch from pokemon.com
  const req = await fetch('https://www.pokemon.com/us/api/pokedex/kalos')
  const json = await req.json()
  // write to file
  const file = path.join(process.cwd(), 'public/data', 'pokedex-kalos.json')
  await fs.writeFile(file, JSON.stringify(json, null, 2))
  // return list of pokemon slugs without variants
  return uniq(map('slug', json))
}
