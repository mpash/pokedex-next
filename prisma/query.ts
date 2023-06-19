import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const pokemon = await prisma.pokemon.findFirst({
    where: {
      number: '0005',
    },
    include: {
      types: true,
      weaknesses: true,
      abilities: true,
      japaneseMeta: true,
      evolvesTo: true,
      evolvesFrom: true,
    },
  })
  console.log(pokemon)
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
