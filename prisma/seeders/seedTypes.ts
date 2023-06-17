import { prisma } from '../seed'

export default async function seedTypes() {
  return Promise.all(
    [
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
    ].map(async type => prisma.pokemonType.create({ data: { type } })),
  )
}
