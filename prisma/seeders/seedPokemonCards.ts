import { Prisma, PrismaClient } from '@prisma/client'
import pokemonCardData from '../../public/data/pokemontcg-io-cards-2.json'

const prisma = new PrismaClient()

export default async function seedPokemonCards() {
  const allPokemonIds = await prisma.pokemon.findMany({
    select: { id: true, sourceId: true },
  })
  createSuperTypes()
  createSubTypes()
  createSets()
  ;(pokemonCardData as PokemonTCG.PokemonCard[]).map(async card => {
    let dataArgs: Prisma.PokemonCardCreateArgs['data'] | {} = {}

    if (card.nationalPokedexNumbers) {
      const pokemonIds = allPokemonIds
        .filter(({ sourceId }) => card.nationalPokedexNumbers.includes(sourceId))
        .map(({ id }) => ({ id }))

      dataArgs = {
        pokemon: {
          connect: pokemonIds,
        },
      }
    }

    if (card.subtypes && card.subtypes.length) {
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

    if (card.supertype) {
      const superTypeModel = await prisma.pokemonCardSetSuperType.findUnique({
        where: { name: card.supertype },
      })

      dataArgs = superTypeModel?.id
        ? {
            ...dataArgs,
            superType: {
              connect: { id: superTypeModel.id },
            },
          }
        : dataArgs
    }

    if (card.set.id) {
      const setModel = await prisma.pokemonCardSet.findFirst({
        where: { sourceId: card.set.id },
      })

      dataArgs = setModel?.id
        ? {
            ...dataArgs,
            set: {
              connect: { id: setModel.id },
            },
          }
        : dataArgs
    }

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

const createSuperTypes = async () => {
  const superTypes = new Map<string, string>()
  ;(pokemonCardData as PokemonTCG.PokemonCard[]).forEach(c => {
    superTypes.set(c.supertype, c.supertype)
  })
  await prisma.pokemonCardSetSuperType.createMany({
    data: Object.keys(Object.fromEntries(superTypes)).map(name => ({ name })),
    skipDuplicates: true,
  })
}

const createSubTypes = async () => {
  const subTypes = new Map<string, string>()
  ;(pokemonCardData as PokemonTCG.PokemonCard[]).forEach(c => {
    if (c.subtypes && c.subtypes.length) {
      c.subtypes.forEach(subType => {
        subTypes.set(subType, subType)
      })
    }
  })
  await prisma.pokemonCardSetSubType.createMany({
    data: Object.keys(Object.fromEntries(subTypes)).map(name => ({ name })),
    skipDuplicates: true,
  })
}

const createSets = async () => {
  const sets = new Map<string, any>()
  ;(pokemonCardData as PokemonTCG.PokemonCard[]).forEach(c => {
    sets.set(c.set.id, c.set)
  })
  sets.forEach(async set => {
    try {
      await prisma.pokemonCardSet.create({
        data: {
          sourceId: set.id,
          name: set.name,
          series: set.series,
          printedTotal: set.printedTotal,
          total: set.total,
          legalities: JSON.stringify(set.legalities),
          ptcgoCode: set.ptcgoCode,
          releaseDate: set.releaseDate,
          symbolUrl: set.images.symbol,
          logoUrl: set.images.logo,
        },
      })
    } catch (e) {
      console.log('set.id', set.id)
      console.log('set.name', set.name)
      console.error(e)
    }
  })
}
