import { Box, Heading, Text } from '@chakra-ui/react'
import FilterBar from '@components/filters/filter-bar'
import PokemonTypeFilter from '@components/filters/pokemon-type-filter'
import PokemonList from '@components/pokemon/pokemon-list'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/future/image'
import { SiPokemon } from 'react-icons/si'

const Home: NextPage = () => {
  return (
    <Box pos="relative">
      <Head>
        <title>Welcome to my Pokedex</title>
        <meta
          name="description"
          content="A Pokedex application written in React with powerful search and filter functionality you won't find anywhere else."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box
        display="grid"
        p={[2, 4]}
        gap={[3, 5]}
        gridTemplateRows="repeat(3, auto) 1fr"
        // w="100%"
        h="100vh"
        // overflow="auto"
      >
        <Box pos="relative">
          <Heading color="gray.700" size={['xl', '3xl']}>
            Pokédex
          </Heading>
          <Text fontSize={['md', 'lg']} color="gray.500">
            Search for a Pokémon by name or using its National Pokédex number.
          </Text>
        </Box>
        <FilterBar />
        <PokemonTypeFilter />
        <PokemonList />
      </Box>
    </Box>
  )
}

export default Home
