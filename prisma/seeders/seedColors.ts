import { PrismaClient } from '@prisma/client'
import pokemonColors from '../../public/data/pokemon-colors.json'

const prisma = new PrismaClient()

export default async function seedColors() {
  for (const file in pokemonColors) {
    const [r, g, b] = pokemonColors[file]
    const pokemonId = await fetchPokemonIdByImage(file)
    if (!pokemonId) return
    await prisma.primaryColor.create({
      data: { pokemonId, r, g, b },
    })
  }
}

const fetchPokemonIdByImage = async (file: string) =>
  (
    await prisma.pokemon.findFirst({
      where: {
        image: {
          endsWith: `/${file}.png`,
        },
      },
      select: { id: true },
    })
  )?.id
