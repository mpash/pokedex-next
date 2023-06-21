import { prisma } from '@src/utils/prisma-edge'
import { Prisma, Pokemon, Region } from '@prisma/client'
import { NextRequest } from 'next/server'

export const config = { runtime: 'edge' }

type Color = {
  r: number
  g: number
  b: number
}

type PokemonListItem = {
  id: number
  name: string
  number: string
  japaneseName: string
  descriptionX: string
  descriptionY: string
  hp: number
  image: string
  height: number
  weight: number
  subVariant: number
  primaryColor: Color
  types: string[]
  weaknesses: string[]
  region: Region
}

export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.has('id')
    ? parseInt(searchParams.get('id') as string)
    : undefined

  if (id) {
    const pokemon = await prisma.pokemon.findUnique({
      where: { id },
      include: {
        types: true,
        weaknesses: true,
        abilities: true,
        japaneseMeta: true,
        primaryColor: true,
        region: true,
        evolvesFrom: true,
        evolvesTo: true,
      },
    })
    if (!pokemon) {
      throw new Error('Unable to find a Pokemon with the given ID: ' + id)
    }
    return new Response(
      JSON.stringify({
        data: {
          ...pokemon,
          types: pokemon.types.map(t => t.type),
          weaknesses: pokemon.weaknesses.map(t => t.type),
        },
      }),
    )
  }

  const pageSize = searchParams.has('pageSize')
    ? parseInt(searchParams.get('pageSize') as string)
    : 20

  const lastId = searchParams.has('lastId')
    ? parseInt(searchParams.get('lastId') as string)
    : undefined

  const lastIdCursor = lastId ? { cursor: { id: lastId }, skip: 1 } : undefined

  let query = searchParams.get('q') ?? undefined
  const isWeaknessCheck = query?.startsWith('weak:')
  query = query?.replace('weak:', '')

  const whereQuery: Prisma.PokemonWhereInput = {}

  if (searchParams.has('hideVariants')) {
    whereQuery.AND = { subVariant: 0 }
  }

  if (query) {
    whereQuery.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { japaneseMeta: { name: { contains: query, mode: 'insensitive' } } },
      { types: { some: { type: { contains: query, mode: 'insensitive' } } } },
      { number: { contains: query } },
    ]
  }

  // Detect any comma separated criterion. ix. "fire,water" "1,2,3" "1-2,5-6"
  const commaSeparatedCriterion = query?.includes(',')
    ? query?.split(',').map(c => c.trim())
    : null

  if (commaSeparatedCriterion?.length) {
    const ranges = commaSeparatedCriterion.filter(c => c.includes('-'))
    const ids = commaSeparatedCriterion.filter(
      c => !Number.isNaN(parseInt(c)) && !ranges.includes(c),
    )
    const queries = commaSeparatedCriterion
      .filter(c => c !== '' && !ids.includes(c) && !ranges.includes(c))
      .map(c => c.toLowerCase())

    if (ids.length) {
      const idsQuery: any = {
        sourceId: {
          in: ids.map(c => parseInt(c)),
        },
      }
      whereQuery.OR = [idsQuery]
    }

    if (queries.length) {
      const typesQuery: Prisma.PokemonWhereInput['OR'] = {
        types: { some: { type: { in: queries } } },
      }
      const weaknessQuery: Prisma.PokemonWhereInput['OR'] = {
        weaknesses: { some: { type: { in: queries } } },
      }

      const nameSearchQuery: Prisma.PokemonWhereInput['OR'] = {
        name: { search: queries.join(' | ') },
      }

      whereQuery.OR = [
        ...(whereQuery.OR as any[]),
        typesQuery,
        nameSearchQuery,
        {
          japaneseMeta: nameSearchQuery,
        },
      ]

      if (isWeaknessCheck) {
        whereQuery.OR = [weaknessQuery]
      }
    }

    if (ranges.length) {
      ranges.forEach(range => appendRangeQuery(range, whereQuery))
    }
  } else {
    // Re-detect range queries without commas
    const hasRange = query?.includes('-')

    if (hasRange && query) {
      appendRangeQuery(query, whereQuery)
    }

    if (isWeaknessCheck) {
      const weaknessQuery: Prisma.PokemonWhereInput['OR'] = {
        weaknesses: { some: { type: { search: query } } },
      }
      whereQuery.OR = [...(whereQuery.OR as any[]), weaknessQuery]
    }
  }

  const pokemon = await prisma.pokemon.findMany({
    include: {
      types: true,
      weaknesses: true,
      abilities: true,
      japaneseMeta: true,
      primaryColor: true,
      region: true,
    },
    where: whereQuery,
    take: pageSize,
    ...lastIdCursor,
  })

  const lastPokemonId = pokemon[pokemon.length - 1]?.id

  return new Response(
    JSON.stringify({
      data: pokemon.map(
        ({
          id,
          name,
          number,
          japaneseMeta,
          descriptionX,
          descriptionY,
          hp,
          image,
          height,
          weight,
          subVariant,
          primaryColor,
          types,
          weaknesses,
          region,
        }) =>
          ({
            id,
            name,
            number,
            japaneseName: japaneseMeta?.name,
            descriptionX,
            descriptionY,
            hp,
            image,
            height,
            weight,
            subVariant,
            primaryColor: {
              r: primaryColor?.r,
              g: primaryColor?.g,
              b: primaryColor?.b,
            },
            types: types.map(type => type.type),
            weaknesses: weaknesses.map(type => type.type),
            region,
          } as PokemonListItem),
      ),
      pagination: {
        pageSize,
        nextPage: generateNextPageUrl(pokemon, pageSize, {
          query,
          lastPokemonId,
        }),
      },
    }),
  )
}

const generateBaseUrl = (pageSize: number, query?: string) => {
  const baseUrl = new URL(
    '/api/pokemon',
    process.env.VERCEL_URL ?? 'http://localhost:3000',
  )
  baseUrl.searchParams.set('pageSize', pageSize.toString())
  query && baseUrl.searchParams.append('q', query)
  return baseUrl
}

function generateNextPageUrl(
  pokemon: Pokemon[],
  pageSize = 20,
  params: {
    query?: string
    lastPokemonId?: number
  },
) {
  const { query, lastPokemonId } = params
  return () => {
    if (!pokemon.length || pokemon.length < pageSize) return null
    const nextPage = generateBaseUrl(pageSize, query)
    lastPokemonId &&
      nextPage.searchParams.append('lastId', lastPokemonId.toString())
    return nextPage
  }
}

function appendRangeQuery(range: string, whereQuery: Prisma.PokemonWhereInput) {
  const [start, end] = range.split('-')
  const startId = parseInt(start)

  const rangeQuery: Prisma.PokemonWhereInput['OR'] = {
    sourceId: {
      gte: startId,
      ...(end ? { lte: parseInt(end) } : {}),
    },
  }

  whereQuery.OR = [...((whereQuery.OR as []) ?? []), rangeQuery]
}
