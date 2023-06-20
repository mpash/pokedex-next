import { PrismaClient } from '@prisma/client'
import seedPokemon from './seeders/seedPokemon'
import seedStats from './seeders/seedStats'
import seedTypes from './seeders/seedTypes'
import seedColors from './seeders/seedColors'
import seedEvolutions from './seeders/seedEvolutions'
import seedPokemonCards from './seeders/seedPokemonCards'

export const prisma = new PrismaClient()

async function main() {
  // await seedTypes()
  // await seedPokemon()
  // await seedStats()
  // await seedColors()
  // await seedEvolutions()
  await seedPokemonCards()
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
