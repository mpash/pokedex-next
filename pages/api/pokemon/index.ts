import { prisma } from '@src/utils/prisma'
import { Prisma, Pokemon, Region } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { get, getOr, has } from 'lodash/fp'

type Color = {
  r: number
  g: number
  b: number
}

export type PokemonListItem = {
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  const queryParseInt = (key: string, defaultValue: number | undefined = undefined) =>
    has(key, req.query) ? parseInt(get(key, req.query) as string) : defaultValue

  

  const id = queryParseInt('id')

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

  const pageSize = queryParseInt('pageSize', 20) as number
  const lastId = queryParseInt('lastId')
  let query = get('q', req.query) as string | undefined
  const hideVariants = get('hideVariants', req.query) === 'true'

  const queryParams = {
    pageSize,
    lastId,
    query,
    hideVariants,
  }

  const lastIdCursor = lastId ? { cursor: { id: lastId }, skip: 1 } : undefined

  const isWeaknessCheck = query?.startsWith('weak:')
  query = query?.replace('weak:', '')

  const whereQuery: Prisma.PokemonWhereInput = {}

  if (hideVariants) {
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

  const nextPage = new URL(
    '/api/pokemon',
    process.env.VERCEL_URL ?? 'http://localhost:3000',
  )
  nextPage.searchParams.set('pageSize', pageSize.toString())
  queryParams.query && nextPage.searchParams.set('q', queryParams.query)
  lastPokemonId && nextPage.searchParams.set('lastId', lastPokemonId.toString())
  hideVariants &&
    nextPage.searchParams.set('hideVariants', hideVariants.toString())

  return res.status(200).json({
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
      nextPage,
    },
  })
}

const generateBaseUrl = (pageSize: number, queryParams: any) => {
  const { query, hideVariants } = queryParams
  const baseUrl = new URL(
    '/api/pokemon',
    process.env.VERCEL_URL ?? 'http://localhost:3000',
  )
  baseUrl.searchParams.set('pageSize', pageSize.toString())
  query && baseUrl.searchParams.set('q', query)
  hideVariants &&
    baseUrl.searchParams.set('hideVariants', hideVariants.toString())
  return baseUrl
}

function generateNextPageUrl(
  pokemon: Pokemon[],
  pageSize = 20,
  queryParams: any,
) {
  const { lastPokemonId } = queryParams
  if (!pokemon.length || pokemon.length < pageSize) return null

  const nextPage = generateBaseUrl(pageSize, queryParams)
  lastPokemonId && nextPage.searchParams.set('lastId', lastPokemonId.toString())

  return nextPage
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
