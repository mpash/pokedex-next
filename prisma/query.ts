import { prisma } from './seed'

async function main() {
  const pokemon = await prisma.pokemon.findFirst({
    where: {
      number: '0003',
    },
    include: {
      types: true,
      weaknesses: true,
      abilities: true,
      japaneseMeta: true,
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
