import { prisma } from '../seed'
import pokemonColors from '../../public/data/pokemon-colors.json'

export default async function seedColors() {
  for (const file in pokemonColors) {
    const [r, g, b] = pokemonColors[file]
    const pokemonIds = await prisma.pokemon.findMany({
      where: {
        image: {
          endsWith: `/${file}.png`,
        },
      },
      select: { id: true },
    })
    const pokemonId = pokemonIds.flat()[0].id
    await prisma.primaryColor.create({
      data: { pokemonId, r, g, b },
      include: { pokemon: true },
    })
  }
}
