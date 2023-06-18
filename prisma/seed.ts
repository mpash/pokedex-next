import { PrismaClient } from '@prisma/client'
import seedPokemon from './seeders/seedPokemon'
import seedStats from './seeders/seedStats'
import seedTypes from './seeders/seedTypes'
import seedColors from './seeders/seedColors'
import seedEvolutions from './seeders/seedEvolutions'

export const prisma = new PrismaClient()

async function main() {
  // await seedTypes()
  // await seedPokemon()
  // await seedStats()
  // await seedColors()
  await seedEvolutions()
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
