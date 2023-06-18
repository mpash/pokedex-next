import { Prisma } from '@prisma/client'
import pokedexUsJpPaldea from '../../public/data/pokedex-us-jp-paldea.json'
import { prisma } from '../seed'

const regionMap = [
  { id: 1, name: 'Kanto' },
  { id: 2, name: 'Johto' },
  { id: 3, name: 'Hoenn' },
  { id: 4, name: 'Sinnoh' },
  { id: 5, name: 'Unova' },
  { id: 6, name: 'Kalos' },
  { id: 7, name: 'Alola' },
  { id: 8, name: 'Galar' },
  { id: 9, name: 'Paldea' },
]
const generationIdMarkers = [151, 251, 386, 493, 649, 721, 809, 905, 1010]

const calculateGeneration = (number: string) => {
  const num = parseInt(number)
  for (let i = 0; i < generationIdMarkers.length; i++) {
    if (num <= generationIdMarkers[i]) {
      return i + 1
    }
  }
  return 1
}

async function seedRegions() {
  for (const region of regionMap) {
    await prisma.region.create({
      data: {
        sourceId: region.id,
        name: region.name,
      },
    })
  }
}

export default async function seedPokemon() {
  await seedRegions()

  for (const key in pokedexUsJpPaldea) {
    const pokemon = pokedexUsJpPaldea[key] as DataSources.PokemonUsJpScrape

    const typeIds = (
      await prisma.pokemonType.findMany({
        where: { type: { in: pokemon.type } },
      })
    ).map(type => ({ id: type.id }))

    const weaknessIds = (
      await prisma.pokemonType.findMany({
        where: { type: { in: pokemon.weakness.map(w => w.toLowerCase()) } },
      })
    ).map(type => ({ id: type.id }))

    await prisma.pokemonAbility.createMany({
      data: pokemon.abilities.map(ability => ({ ability })),
      skipDuplicates: true,
    })

    const abilityIds = (
      await prisma.pokemonAbility.findMany({
        where: { ability: { in: pokemon.abilities } },
      })
    ).map(ability => ({ id: ability.id }))

    const japaneseMeta: {
      japaneseMeta?: Prisma.JapaneseMetaUpdateOneWithoutPokemonNestedInput
    } = pokemon.japaneseData
      ? {
          japaneseMeta: {
            create: {
              ...pokemon.japaneseData,
            },
          },
        }
      : {}

    const regionSourceId = calculateGeneration(pokemon.number)

    await prisma.pokemon.create({
      data: {
        sourceId: pokemon.id,
        name:
          pokemon.scrapedData.name === 'Alolan Form'
            ? `${pokemon.name} (Alolan Form)`
            : pokemon.scrapedData.name,
        slug: pokemon.slug,
        number: pokemon.number,
        weight: pokemon.weight,
        height: pokemon.height,
        image: pokemon.scrapedData.image,
        descriptionX: pokemon.scrapedData.descriptionX,
        descriptionY: pokemon.scrapedData.descriptionY,
        detailPageURL: pokemon.detailPageURL,
        collectiblesSlug: pokemon.collectibles_slug,
        thumbnailAltText: pokemon.ThumbnailAltText,
        thumbnailImage: pokemon.ThumbnailImage,
        subVariant: pokemon.subVariant,
        types: { connect: typeIds },
        weaknesses: { connect: weaknessIds },
        abilities: { connect: abilityIds },
        region: { connect: { sourceId: regionSourceId } },
        ...japaneseMeta,
      },
      include: {
        types: true,
        weaknesses: true,
        abilities: true,
      },
    })
  }
}
