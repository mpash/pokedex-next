import { Prisma, PrismaClient } from '@prisma/client'
import pokemonCardData from '../../public/data/pokemontcg-io-cards-2.json'

const prisma = new PrismaClient()

export default async function seedPokemonCards() {
  const allPokemonIds = await prisma.pokemon.findMany({
    select: { id: true, sourceId: true },
  })
  ;(pokemonCardData as PokemonTCG.PokemonCard[]).map(async card => {
    let dataArgs: Prisma.PokemonCardCreateArgs['data'] | {} = {}

    if (card.nationalPokedexNumbers) {
      const pokemonIds = allPokemonIds
        .filter(({ sourceId }) =>
          card.nationalPokedexNumbers.includes(sourceId),
        )
        .map(({ id }) => ({ id }))

      dataArgs = {
        pokemon: {
          connect: pokemonIds,
        },
      }
    }

    if (card.subtypes && card.subtypes.length) {
      await prisma.pokemonCardSetSubType.createMany({
        data: card.subtypes.map(subType => ({ name: subType })),
        skipDuplicates: true,
      })

      const subTypeIds = await prisma.pokemonCardSetSubType.findMany({
        where: { name: { in: card.subtypes } },
        select: { id: true },
      })

      dataArgs = {
        ...dataArgs,
        subTypes: {
          connect: subTypeIds.map(({ id }) => ({ id })),
        },
      }
    }

    // if (card.supertype) {
    //   let superTypeModelId: number | null = null
    //   try {
    //     const superTypeModel =
    //       await prisma.pokemonCardSetSuperType.findFirstOrThrow({
    //         where: { name: card.supertype },
    //       })

    //     superTypeModelId = superTypeModel.id
    //   } catch (e) {
    //     const create = await prisma.pokemonCardSetSuperType.create({
    //       data: { name: card.supertype },
    //     })
    //     superTypeModelId = create.id
    //   }

    //   dataArgs = {
    //     ...dataArgs,
    //     superType: {
    //       connect: { id: superTypeModelId },
    //     },
    //   }
    // }

    try {
      await prisma.pokemonCard.create({
        data: {
          sourceId: card.id,
          data: JSON.stringify(card),
          imageSm: card.images.small,
          imageLg: card.images.large,
          name: card.name,
          number: card.number,
          artist: card.artist,
          rarity: card.rarity,
          // Optional
          rules: card.rules,
          hp: card.hp,
          types: card.types,
          abilities: JSON.stringify(card.abilities),
          attacks: JSON.stringify(card.attacks),
          weaknesses: JSON.stringify(card.weaknesses),
          retreatCost: card.retreatCost,
          convertedRetreatCost: card.convertedRetreatCost,
          flavorText: card.flavorText,
          // Relations
          set: {
            connectOrCreate: {
              where: { sourceId: card.set.id },
              create: {
                sourceId: card.set.id,
                name: card.set.name,
                series: card.set.series,
                printedTotal: card.set.printedTotal,
                total: card.set.total,
                legalities: JSON.stringify(card.set.legalities),
                ptcgoCode: card.set.ptcgoCode,
                releaseDate: card.set.releaseDate,
                symbolUrl: card.set.images.symbol,
                logoUrl: card.set.images.logo,
              },
            },
          },
          ...dataArgs,
        },
      })
    } catch (e) {
      console.log('card.id', card.id)
      console.log('card.name', card.name)
      console.error(e)
    }
  })
}
