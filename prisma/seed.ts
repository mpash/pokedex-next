import { PrismaClient } from '@prisma/client'
import seedPokemon from './seeders/seedPokemon'
import seedStats from './seeders/seedStats'
import seedTypes from './seeders/seedTypes'
import seedColors from './seeders/seedColors'

export const prisma = new PrismaClient()

async function main() {
  // await seedTypes()
  // await seedPokemon()
  // await seedStats()
  await seedColors()
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
