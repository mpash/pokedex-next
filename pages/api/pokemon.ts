import { Prisma } from '@prisma/client'
import { prisma } from '@src/utils/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export type Pokemon = {
  id: number
  name: string
  number: string
  japaneseName: string
  hp: number
  height: number
  weight: number
  image: string
  subVariant: number
  types: PokemonType[]
  weaknesses: PokemonType[]
  primaryColor: Color
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
      },
    })
    if (!pokemon) {
      throw new Error('Unable to find a Pokemon with the given ID: ' + id)
    }
    return res.status(200).json({
      data: {
        ...pokemon,
        types: pokemon.types.map(type => type.type),
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

  const query = req.query.q ? (req.query.q as string) : undefined

  const whereQuery = query
    ? {
        where: {
          OR: [
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
              number: {
                contains: query,
              },
            },
          ],
        } as Prisma.PokemonWhereInput,
      }
    : undefined

  const pokemon = await prisma.pokemon.findMany({
    include: {
      types: true,
      weaknesses: true,
      abilities: true,
      japaneseMeta: true,
      primaryColor: true,
    },
    take: pageSize,
    ...lastIdCursor,
    where: {
      ...whereQuery?.where,
    },
    ...whereQuery,
  })

  const lastPokemonId = pokemon[pokemon.length - 1]?.id

  const generateBaseUrl = () => {
    const baseUrl = new URL('/api/pokemon', 'http://localhost:3000')
    baseUrl.searchParams.set('pageSize', pageSize.toString())
    return baseUrl
  }

  const generateNextPageUrl = () => {
    if (!pokemon.length) return null
    const nextPage = generateBaseUrl()
    lastPokemonId &&
      nextPage.searchParams.append('lastId', lastPokemonId.toString())
    return nextPage
  }

  return (
    res
      .status(200)
      // .json({ data: pokemon, pagination: generatePaginationMeta(1, 20, 20) })
      .json({
        data: pokemon.map(
          pokemon =>
            ({
              id: pokemon.id,
              name: pokemon.name,
              number: pokemon.number,
              japaneseName: pokemon?.japaneseMeta?.name,
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
            } as Pokemon),
        ),
        pagination: {
          pageSize,
          nextPage: generateNextPageUrl(),
        },
      })
  )
}
