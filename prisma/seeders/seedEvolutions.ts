import { prisma } from '../seed'
import pokedexUsJpPaldea from '../../public/data/pokedex-us-jp-paldea.json'

// Example of evolution chain ['bulbasaur','ivysaur','venusaur']

/**
 * We cannot run during pokemon seeding because all pokemon need to be defined first before we can reference them
 * @returns
 */
export default async function seedEvolutions() {
  const pokemonList = pokedexUsJpPaldea.slice(0, 1).map(pokemon => ({
    number: pokemon.number,
    evolutions: pokemon.scrapedData.evolutionChain,
  }))

  // for (const pokemon of pokemonList) {
  //   const { number, evolutions } = pokemon
  //   // const pokemonList = await prisma.pokemon.findMany({ where: { number } })

  //   const ids = await Promise.all(
  //     evolutions.map(async evolutionSlug =>
  //       (
  //         await prisma.pokemon.findMany({
  //           where: {
  //             slug: {
  //               equals: evolutionSlug,
  //               mode: 'insensitive',
  //             },
  //           },
  //           select: { id: true },
  //         })
  //       ).map(e => e.id),
  //     ),
  //   )

  //   ids.map((evolveToIds, index) => {
      
  //   })

  //   // for (const evolutionSlug of evolutions) {
  //   //   const order = evolutions.indexOf(evolutionSlug) + 1
  //   //   const evolveToList = await prisma.pokemon.findMany({
  //   //     where: {
  //   //       slug: {
  //   //         equals: evolutionSlug,
  //   //         mode: 'insensitive',
  //   //       },
  //   //     },
  //   //     select: { id: true },
  //   //   })
  //   //   evolveToList.forEach(evolveTo => {
  //   //     pokemonList.forEach(async pokemon => {
  //   //       await prisma.pokemonEvolution.create({
  //   //         data: {
  //   //           order,
  //   //           evolveFrom: {
  //   //             connect: { id: pokemon.id },
  //   //           },
  //   //           evolveTo: {
  //   //             connect: { id: evolveTo.id },
  //   //           },
  //   //         },
  //   //       })
  //   //     })
  //   //   })
  //   // }
  // }
}
