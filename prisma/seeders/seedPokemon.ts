import { Prisma } from '@prisma/client'
import pokedexUsJpKalos from '../../public/data/pokedex-us-jp-kalos.json'
import { prisma } from '../seed'

export default async function seedPokemon() {
  for (const key in pokedexUsJpKalos) {
    const pokemon = pokedexUsJpKalos[key] as DataSources.PokemonUsJpScrape

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
