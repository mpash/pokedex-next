import { PrismaClient } from '@prisma/client'
import { fetchBuilder, FileSystemCache } from 'node-fetch-cache'

const fetch = fetchBuilder.withCache(new FileSystemCache({}))

const prisma = new PrismaClient()

const columnOrder = ['hp', 'attack', 'defense', 'spAttack', 'spDefense', 'speed'] as const

type StatName = (typeof columnOrder)[number]

const transformStatName = (name: string): StatName => {
  if (name === 'special-attack') return 'spAttack'
  if (name === 'special-defense') return 'spDefense'
  if (name! in columnOrder) throw new Error(`Unknown stat name: ${name}`)
  return name as StatName
}

const fetchPokemonDetails = async (sourceId: number, attempt = 1) => {
  try {
    const pokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${sourceId}`)
    const pokemon: any = await pokemonRes.json()

    if (!pokemonRes.ok) {
      throw new Error('Failed to fetch pokemon details for sourceId: ' + sourceId)
    }

    return pokemon
  } catch (e) {
    if (attempt > 3) throw new Error('Max retries exceeded')
    console.log(`Retrying fetch for pokemon ${sourceId}`)
    // Exponential back-off
    await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
    return fetchPokemonDetails(sourceId, attempt + 1)
  }
}

export default async function seedStats() {
  const pokemonList = await prisma.pokemon.findMany({
    select: { sourceId: true },
    orderBy: { sourceId: 'asc' },
    distinct: ['sourceId'],
  })

  await Promise.all(
    pokemonList.map(async ({ sourceId }) => {
      const pokemon = await fetchPokemonDetails(sourceId)

      const stats = (
        pokemon.stats as {
          base_stat: number
          effort: number
          stat: { name: string; url: string }
        }[]
      )
        .map(stat => ({
          name: transformStatName(stat.stat.name),
          value: stat.base_stat,
        }))
        .sort((a, b) => {
          const aIndex = columnOrder.indexOf(a.name)
          const bIndex = columnOrder.indexOf(b.name)
          return aIndex - bIndex
        })
        .reduce((acc, stat) => {
          acc[stat.name] = stat.value
          return acc
        }, {} as Record<StatName, number>)

      await prisma.pokemon.updateMany({
        data: stats,
        where: { sourceId },
      })
    }),
  )
}
