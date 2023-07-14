import { prisma } from '@/prisma/seed'
import { Prisma } from '@prisma/client'
import { z } from 'zod'
import { publicProcedure, router } from '../trpc'
import { baseApiUrl } from '@src/utils'

export const appRouter = router({
  pokemonList: publicProcedure
    .input(
      z.object({
        pageSize: z.number().optional().default(20),
        lastId: z.number().optional(),
        query: z.string().optional(),
        hideVariants: z.boolean().optional().default(false),
      }),
    )
    .query(async ({ input }) => {
      const pageSize = input.pageSize
      const lastId = input.lastId
      const hideVariants = input.hideVariants

      // Parse query
      let query = input.query
      const isWeaknessCheck = query?.startsWith('weak:')
      query = query?.replace('weak:', '')

      const lastIdCursor = lastId
        ? {
            cursor: { id: lastId },
            skip: 1,
          }
        : undefined

      const whereQuery: Prisma.PokemonWhereInput = {}

      if (hideVariants) {
        whereQuery.AND = hideVariantsAndQuery
      }

      const searchQuery = generateSearchQuery(query)

      if (query) {
        whereQuery.OR = searchQuery
      }

      // Detect any comma separated criterion. ix. "fire,water" "1,2,3" "1-2,5-6"
      const commaSeparatedCriterion = query?.includes(',') ? query?.split(',').map(c => c.trim()) : null

      if (commaSeparatedCriterion?.length) {
        const ranges = commaSeparatedCriterion.filter(c => c.includes('-'))
        const ids = commaSeparatedCriterion.filter(c => !Number.isNaN(parseInt(c)) && !ranges.includes(c))
        const queries = commaSeparatedCriterion
          .filter(c => c !== '' && !ids.includes(c) && !ranges.includes(c))
          .map(c => c.toLowerCase())

        if (ids.length) {
          const idsQuery: any = {
            sourceId: {
              in: ids.map(c => parseInt(c)),
            },
          }
          whereQuery.OR = [idsQuery]
        }

        if (queries.length) {
          const typesQuery: Prisma.PokemonWhereInput = {
            types: {
              some: {
                type: {
                  in: queries,
                },
              },
            },
          }
          const weaknessQuery: Prisma.PokemonWhereInput = {
            weaknesses: {
              some: {
                type: {
                  in: queries,
                },
              },
            },
          }

          const nameSearchQuery: Prisma.PokemonWhereInput = {
            name: {
              search: queries.join(' | '),
            },
          }

          whereQuery.OR = [
            ...(whereQuery.OR as any[]),
            typesQuery,
            nameSearchQuery,
            {
              japaneseMeta: nameSearchQuery,
            },
          ]

          if (isWeaknessCheck) {
            whereQuery.OR = [weaknessQuery]
          }
        }

        if (ranges.length) {
          ranges.forEach(range => appendRangeQuery(range, whereQuery))
        }
      } else {
        // Re-detect range queries without commas
        const hasRange = query?.includes('-')

        if (hasRange && query) {
          appendRangeQuery(query, whereQuery)
        }

        if (isWeaknessCheck) {
          const weaknessQuery: Prisma.PokemonWhereInput = {
            weaknesses: {
              some: {
                type: {
                  search: query,
                },
              },
            },
          }
          whereQuery.OR = [...(whereQuery.OR as any[]), weaknessQuery]
        }
      }

      const pokemon = await prisma.pokemon.findMany({
        include: {
          types: true,
          weaknesses: true,
          abilities: true,
          japaneseMeta: true,
          primaryColor: true,
          region: true,
        },
        where: whereQuery,
        take: pageSize,
        ...lastIdCursor,
      })

      const lastPokemonId = pokemon[pokemon.length - 1]?.id

      const generateBaseUrl = () => {
        const url = new URL('/api/pokemon', baseApiUrl)
        url.searchParams.set('pageSize', pageSize.toString())
        query && url.searchParams.append('q', query)
        return url
      }

      const generateNextPageUrl = () => {
        if (!pokemon.length || pokemon.length < pageSize) return null
        const nextPage = generateBaseUrl()
        lastPokemonId && nextPage.searchParams.append('lastId', lastPokemonId.toString())
        return nextPage
      }

      return {
        data: pokemon.map(pokemon => ({
          id: pokemon.id,
          name: pokemon.name,
          number: pokemon.number,
          japaneseName: pokemon?.japaneseMeta?.name,
          // descriptionX: pokemon.descriptionX,
          // descriptionY: pokemon.descriptionY,
          hp: pokemon.hp,
          image: pokemon.image,
          height: pokemon.height,
          weight: pokemon.weight,
          subVariant: pokemon.subVariant,
          primaryColor: {
            r: pokemon.primaryColor?.r,
            g: pokemon.primaryColor?.g,
            b: pokemon.primaryColor?.b,
          },
          types: pokemon.types.map(type => type.type),
          weaknesses: pokemon.weaknesses.map(type => type.type),
          region: pokemon.region,
        })),
        pagination: {
          pageSize,
          nextPage: generateNextPageUrl(),
        },
      }
    }),
  pokemonById: publicProcedure.input(z.number()).query(async ({ input }) => {
    const pokemon = await prisma.pokemon.findUnique({
      where: { id: input },
      include: {
        types: true,
        weaknesses: true,
        abilities: true,
        japaneseMeta: true,
        primaryColor: true,
        region: true,
        evolvesFrom: true,
        evolvesTo: true,
      },
    })

    if (!pokemon) {
      throw new Error('Unable to find a Pokemon with the given ID: ' + input)
    }

    return {
      data: {
        ...pokemon,
        types: pokemon.types.map(t => t.type),
        weaknesses: pokemon.weaknesses.map(t => t.type),
      },
    }
  }),
})

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter

function generateSearchQuery(query: string | undefined): Prisma.PokemonWhereInput[] {
  return [
    {
      name: {
        contains: query,
        mode: 'insensitive',
      },
    },
    {
      japaneseMeta: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
    },
    {
      types: {
        some: {
          type: {
            contains: query,
            mode: 'insensitive',
          },
        },
      },
    },
    {
      number: {
        contains: query,
      },
    },
  ]
}

const hideVariantsAndQuery: Prisma.PokemonWhereInput['AND'] = {
  subVariant: 0,
}

function appendRangeQuery(range: string, whereQuery: Prisma.PokemonWhereInput) {
  const [start, end] = range.split('-')
  const startId = parseInt(start)

  const rangeQuery: any = {
    sourceId: {
      gte: startId,
    },
  }

  if (end) {
    const endId = parseInt(end)
    rangeQuery.sourceId.lte = endId
  }

  whereQuery.OR = [...((whereQuery.OR as Prisma.PokemonWhereInput['OR'][]) ?? []), rangeQuery]
}
