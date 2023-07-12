import { Box, Heading, Text } from '@chakra-ui/react'
import FilterBar from '@components/filters/filter-bar'
import PokemonTypeFilter from '@components/filters/pokemon-type-filter'
import PaginationBar from '@components/pagination-bar'
import PokemonList from '@components/pokemon/pokemon-list'
import TypeSummary from '@components/type-summary'
import { FilterProvider } from '@src/hooks/useFilters'
import { PaginationProvider } from '@src/hooks/usePagination'
import { SelectedPokemonTypesProvider } from '@src/hooks/useSelectedPokemonTypes'
import Head from 'next/head'
import { NextPage } from 'next/types'

const Pokedex: NextPage = () => (
  <Box pos="relative">
    <Head>
      <title>Type Calculator</title>
      <meta
        name="description"
        content="An advanced Pokedex Type Calculator with powerful search and filter functionality you won't find anywhere else."
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Box
      display="grid"
      p={[2, 4]}
      gap={[3, 5]}
      gridTemplateRows="repeat(3, auto) 1fr"
      h="100vh"
    >
      <Box pos="relative">
        <Heading color="gray.700" size={['xl', '3xl']}>
          Pokédex
        </Heading>
        <Text fontSize={['md', 'lg']} color="gray.500">
          Search for a Pokémon by name or using its National Pokédex number.
        </Text>
      </Box>
      <SelectedPokemonTypesProvider>
        <PaginationProvider>
          <FilterProvider>
            <PokedexContent />
          </FilterProvider>
        </PaginationProvider>
      </SelectedPokemonTypesProvider>
    </Box>
  </Box>
)

export default Pokedex

const PokedexContent = () => (
  <>
    <FilterBar />
    <PokemonTypeFilter />
    <PokemonList />
    <TypeSummary />
    <PaginationBar />
  </>
)
