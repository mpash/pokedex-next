import { Pokemon, Prisma } from '@prisma/client'
import { TypeWeakness } from '@src/data/typeCalculator'
import { prisma } from '@src/utils/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export type PokemonDetail = Partial<Prisma.PokemonSelect> & {
  types: string[]
  weaknesses: string[]
  typeWeaknesses: TypeWeakness
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const id = req.query.pokemonId ? parseInt(req.query.pokemonId as string) : undefined

  const pokemon = await prisma.pokemon.findUnique({
    where: { id },
    include: {
      types: true,
      weaknesses: true,
      japaneseMeta: true,
      primaryColor: true,
      pokemonCards: true,
    },
  })

  let evolutions: Pokemon[] = []
  if (pokemon?.evolutionChain) {
    evolutions = await prisma.pokemon.findMany({
      where: {
        slug: {
          in: pokemon?.evolutionChain.split(','),
          mode: 'insensitive',
        },
      },
      orderBy: {
        id: 'asc',
      },
    })
  }

  if (!pokemon) {
    throw new Error('Unable to find a Pokemon with the given ID: ' + id)
  }

  return res.status(200).json({
    data: {
      ...pokemon,
      types: pokemon.types.map(t => t.type),
      weaknesses: pokemon.weaknesses.map(t => t.type),
      evolutions,
    },
  })
}
