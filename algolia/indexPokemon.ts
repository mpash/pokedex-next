import algoliasearch from 'algoliasearch'
import { PrismaClient } from '@prisma/client'

// API keys below contain actual values tied to your Algolia account
const client = algoliasearch('0YYVXT3Y81', '3f8d634d18b70d7b0357564e6978ccac')
const index = client.initIndex('Pokemon')

const prisma = new PrismaClient()

async function main() {
  const pokemon = await prisma.pokemon.findMany({
    include: { japaneseMeta: true, types: true },
  })
  for (const p of pokemon) {
    const result: any = {}
    result.objectID = p.id

    result.name = p.name
    result.number = p.number
    result.japaneseName = p.japaneseMeta?.name
    result.types = p.types.map(t => t.type)

    index.saveObject(result)
  }
}

main()
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
