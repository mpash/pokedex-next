import { PrismaClient } from '@prisma/client'
import pokedexUsJpPaldea from '../../public/data/pokedex-us-jp-paldea.json'
import { uniqBy } from 'lodash/fp'

const prisma = new PrismaClient()

/**
 * We cannot run during pokemon seeding because all pokemon need to be defined first before we can reference them
 * Example of evolution chain: ['bulbasaur','ivysaur','venusaur']
 * @returns
 */
export default async function seedEvolutions() {
  const pokemonList = pokedexUsJpPaldea.map(
    pokemon => pokemon.scrapedData.evolutionChain as string[],
  )

  const uniqChains = uniqBy(entry => entry.join(','), pokemonList)

  uniqChains.forEach(async evolutionChain => {
    evolutionChain.forEach(async evolutionPokemonSlug => {
      const pokemon = await prisma.pokemon.findMany({
        where: {
          slug: {
            equals: evolutionPokemonSlug,
            mode: 'insensitive',
          },
        },
        select: {
          id: true,
        },
      })
      if (!pokemon.length) {
        console.log(`Pokemon ${evolutionPokemonSlug} not found`)
        return
      }

      // Update pokemon with plain text evolution chain
      await prisma.pokemon.updateMany({
        where: {
          id: {
            in: pokemon.map(p => p.id),
          },
        },
        data: {
          evolutionChain: evolutionChain.join(','),
        },
      })

      const evolveToSlug =
        evolutionChain[evolutionChain.indexOf(evolutionPokemonSlug) + 1]

      if (!evolveToSlug) {
        console.log(`Pokemon ${evolutionPokemonSlug} is the last evolution`)
        return
      }

      const evolvesTo = await prisma.pokemon.findMany({
        where: {
          slug: {
            equals: evolveToSlug,
            mode: 'insensitive',
          },
        },
        select: {
          id: true,
        },
      })

      pokemon.forEach(async pokemon => {
        await prisma.pokemon.update({
          where: { id: pokemon.id },
          data: {
            evolvesTo: {
              connect: evolvesTo.map(e => ({ id: e.id })),
            },
          },
        })
      })
    })
  })
}
