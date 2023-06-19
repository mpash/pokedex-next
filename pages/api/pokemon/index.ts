import { Prisma } from '@prisma/client'
import { prisma } from '@src/utils/prisma'
import { isEmpty, isNumber } from 'lodash/fp'
import { NextApiRequest, NextApiResponse } from 'next'

export type Pokemon = {
  id: number
  name: string
  number: string
  japaneseName: string
  descriptionX: string
  descriptionY: string
  hp: number
  height: number
  weight: number
  image: string
  subVariant: number
  types: PokemonType[]
  weaknesses: PokemonType[]
  primaryColor: Color
  region: {
    id: number
    name: string
  }
  evolvesFrom?: Pokemon[]
  evolvesTo?: Pokemon[]
  evolutionChain?: string[]
  evolutions?: Omit<
    Pokemon[],
    'types' | 'weaknesses' | 'primaryColor' | 'region'
  >
}

type Color = {
  r: number
  g: number
  b: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  const id = req.query.id ? parseInt(req.query.id as string) : undefined

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
    return res.status(200).json({
      data: {
        ...pokemon,
        types: pokemon.types.map(t => t.type),
        weaknesses: pokemon.weaknesses.map(t => t.type),
      },
    })
  }

  const pageSize = req.query.pageSize
    ? parseInt(req.query.pageSize as string)
    : 20

  const lastId = req.query.lastId
    ? parseInt(req.query.lastId as string)
    : undefined

  const lastIdCursor = lastId
    ? {
        cursor: { id: lastId },
        skip: 1,
      }
    : undefined

  let query = req.query.q ? (req.query.q as string) : undefined
  const isWeaknessCheck = query?.startsWith('weak:')
  query = query?.replace('weak:', '')
  const hideVariantsAndQuery: Prisma.PokemonWhereInput['AND'] = req.query
    .hideVariants
    ? {
        subVariant: 0,
      }
    : {}

  const whereQuery: Prisma.PokemonWhereInput = {}

  if (!isEmpty(hideVariantsAndQuery)) {
    whereQuery.AND = hideVariantsAndQuery
  }

  if (query) {
    whereQuery.OR = [
      {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      {
        japaneseMeta: {
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
      },
      {
        types: {
          some: {
            type: {
              contains: query,
              mode: 'insensitive',
            },
          },
        },
      },
      {
        number: {
          contains: query,
        },
      },
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
        types: {
          some: {
            type: {
              in: queries,
            },
          },
        },
      }
      const weaknessQuery: Prisma.PokemonWhereInput['OR'] = {
        weaknesses: {
          some: {
            type: {
              in: queries,
            },
          },
        },
      }

      const nameSearchQuery: Prisma.PokemonWhereInput['OR'] = {
        name: {
          search: queries.join(' | '),
        },
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
        weaknesses: {
          some: {
            type: {
              search: query,
            },
          },
        },
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

  const generateBaseUrl = () => {
    const baseUrl = new URL(
      '/api/pokemon',
      process.env.VERCEL_URL ?? 'http://localhost:3000',
    )
    baseUrl.searchParams.set('pageSize', pageSize.toString())
    query && baseUrl.searchParams.append('q', query)
    return baseUrl
  }

  const generateNextPageUrl = () => {
    if (!pokemon.length || pokemon.length < pageSize) return null
    const nextPage = generateBaseUrl()
    lastPokemonId &&
      nextPage.searchParams.append('lastId', lastPokemonId.toString())
    return nextPage
  }

  return res.status(200).json({
    data: pokemon.map(
      pokemon =>
        ({
          id: pokemon.id,
          name: pokemon.name,
          number: pokemon.number,
          japaneseName: pokemon?.japaneseMeta?.name,
          descriptionX: pokemon.descriptionX,
          descriptionY: pokemon.descriptionY,
          hp: pokemon.hp,
          image: pokemon.image,
          height: pokemon.height,
          weight: pokemon.weight,
          subVariant: pokemon.subVariant,
          primaryColor: {
            r: pokemon.primaryColor?.r,
            g: pokemon.primaryColor?.g,
            b: pokemon.primaryColor?.b,
          },
          types: pokemon.types.map(type => type.type),
          weaknesses: pokemon.weaknesses.map(type => type.type),
          region: pokemon.region,
        } as Pokemon),
    ),
    pagination: {
      pageSize,
      nextPage: generateNextPageUrl(),
    },
  })
}

function appendRangeQuery(range: string, whereQuery: Prisma.PokemonWhereInput) {
  const [start, end] = range.split('-')
  const startId = parseInt(start)

  const rangeQuery: any = {
    sourceId: {
      gte: startId,
    },
  }

  if (end) {
    const endId = parseInt(end)
    rangeQuery.sourceId.lte = endId
  }

  whereQuery.OR = [
    ...((whereQuery.OR as Prisma.PokemonWhereInput['OR'][]) ?? []),
    rangeQuery,
  ]
}
