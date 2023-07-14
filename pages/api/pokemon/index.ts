import { Prisma, Region } from '@prisma/client'
import withNextCors from '@src/client/withNextCors'
import { getBaseUrl } from '@src/utils'
import { prisma } from '@src/utils/prisma'
import { get, has } from 'lodash/fp'
import { NextApiRequest, NextApiResponse } from 'next'

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

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const queryParseInt = (key: string, defaultValue: number | undefined = undefined) =>
    has(key, req.query) ? parseInt(get(key, req.query) as string) : defaultValue

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
  const commaSeparatedCriterion = query?.includes(',') ? query?.split(',').map(c => c.trim()) : null

  if (commaSeparatedCriterion?.length) {
    const ranges = commaSeparatedCriterion.filter(c => c.includes('-'))
    const ids = commaSeparatedCriterion.filter(c => !Number.isNaN(parseInt(c)) && !ranges.includes(c))
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
      const typesQuery: Prisma.PokemonWhereInput = {
        types: { some: { type: { in: queries } } },
      }
      const weaknessQuery: Prisma.PokemonWhereInput = {
        weaknesses: { some: { type: { in: queries } } },
      }

      const nameSearchQuery: Prisma.PokemonWhereInput = {
        name: { search: queries.join(' | ') },
      }

      whereQuery.OR = [
        ...(whereQuery.OR as any[]),
        typesQuery,
        nameSearchQuery,
        { japaneseMeta: nameSearchQuery },
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
      const weaknessQuery: Prisma.PokemonWhereInput = {
        weaknesses: { some: { type: { search: query } } },
      }
      whereQuery.OR = [...(whereQuery.OR as any[]), weaknessQuery]
    }
  }

  const pokemon = await prisma.pokemon.findMany({
    where: whereQuery,
    take: pageSize,
    ...lastIdCursor,
    select: {
      id: true,
      name: true,
      number: true,
      japaneseMeta: { select: { name: true } },
      descriptionX: true,
      descriptionY: true,
      hp: true,
      image: true,
      height: true,
      weight: true,
      subVariant: true,
      primaryColor: { select: { r: true, g: true, b: true } },
      types: { select: { type: true } },
      weaknesses: { select: { type: true } },
      region: true,
    },
  })

  const nextPage = (() => {
    const lastPokemonId = pokemon[pokemon.length - 1]?.id
    if (!lastPokemonId || pokemon.length < pageSize) return null

    const nextPage = new URL('/api/pokemon', getBaseUrl())
    nextPage.searchParams.set('pageSize', pageSize.toString())
    queryParams.query && nextPage.searchParams.set('q', queryParams.query)
    lastPokemonId && nextPage.searchParams.set('lastId', lastPokemonId.toString())
    hideVariants && nextPage.searchParams.set('hideVariants', hideVariants.toString())

    return nextPage.toString()
  })()

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
      count: pokemon.length,
      nextPage,
    },
  })
}

export default withNextCors(handler)

function appendRangeQuery(range: string, whereQuery: Prisma.PokemonWhereInput) {
  const [start, end] = range.split('-')
  const startId = parseInt(start)

  const rangeQuery: Prisma.PokemonWhereInput = {
    sourceId: {
      gte: startId,
      ...(end ? { lte: parseInt(end) } : {}),
    },
  }

  whereQuery.OR = [...((whereQuery.OR as []) ?? []), rangeQuery]
}
