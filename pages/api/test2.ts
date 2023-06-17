import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs/promises'
import path from 'path'

const normalizeId = (number: Pokemon['number']) => {
  return parseInt(number.split('#')[1])
}

const addSubVariantToPokemonList = (
  pokemonList: DataSources.PokemonUs[],
): (DataSources.PokemonUs & {
  subVariant: number
})[] => {
  const pokemonCountMap = new Map<string, number>()

  return pokemonList.map(pokemon => {
    const subVariant = pokemonCountMap.has(pokemon.number)
      ? pokemonCountMap.get(pokemon.number)!
      : 0

    pokemonCountMap.set(pokemon.number, subVariant + 1)

    return { ...pokemon, subVariant }
  })
}

const dataPath = (file: string) => path.join(process.cwd(), 'public/data', file)
const fileData = async <TData>(file: string): Promise<TData> => {
  const data = await fs.readFile(dataPath(file), 'utf-8')
  return JSON.parse(data)
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  const data: any[] = []

  const pokedexUsKalos = await fileData<DataSources.PokemonUs[]>(
    'pokedex-us-kalos.json',
  )
  const pokedexUsKalosScrape = await fileData<DataSources.PokemonUsScrape[]>(
    'pokedex-us-kalos-scrape.json',
  )
  const pokedexJpKalos = await fileData<DataSources.PokemonJp[]>(
    'pokedex-jp-kalos.json',
  )

  addSubVariantToPokemonList(pokedexUsKalos).forEach(pokemon => {
    const jpPokemon = pokedexJpKalos.find(
      ({ no, sub }) => no === pokemon.number && sub === pokemon.subVariant,
    )
    const scrapedPokemon = pokedexUsKalosScrape.find(
      ({ number, subVariant }) =>
        number === pokemon.number && subVariant === pokemon.subVariant,
    )

    if (!jpPokemon)
      console.warn('Unable to find matching Japanese entry:', {
        subVariant: pokemon.subVariant,
        number: pokemon.number,
      })

    if (!scrapedPokemon)
      console.warn('Unable to find matching scraped entry:', {
        subVariant: pokemon.subVariant,
        number: pokemon.number,
      })

    data.push({
      ...pokemon,
      scrapedData: scrapedPokemon,
      japaneseData: jpPokemon,
    })
  })

  return res.status(200).json(data)
}
