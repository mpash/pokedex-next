import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const types = [
  'grass',
  'fire',
  'water',
  'electric',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
  'normal',
] as const

export default async function seedTypes() {
  return prisma.pokemonType.createMany({
    data: types.map(type => ({ type })),
  })
}
