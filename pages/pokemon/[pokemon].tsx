import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Select,
  Stack,
  Text,
} from '@chakra-ui/react'
import { PokemonTypes } from '@components/pokemon'
import { pokemonTypeData } from '@data/pokemon-types'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { MdCatchingPokemon } from 'react-icons/md'
import { useQuery } from 'react-query'

const PokemonDetail = () => {
  const router = useRouter()
  const id = router.query.pokemon as string
  const [selectedVariant, setSelectedVariant] = useState(0)
  const [xOrY, setXOrY] = useState<'x' | 'y'>('x')
  const { isLoading, data: pokemon } = useQuery(
    ['pokemon', { id }],
    async () => {
      const json = await fetch(`/api/pokemon?id=${id}`).then(res => res.json())
      return json
    },
    {
      enabled: !!id,
    },
  )

  if (isLoading) {
    return <Heading>Loading...</Heading>
  }

  if (!pokemon) {
    return <Heading>Pokemon not found</Heading>
  }

  const longId = pokemon.id.toString().padStart(3, '0')

  const primaryType = pokemonTypeData[pokemon.type[0]]

  return (
    <Box minH="100vh">
      <Stack spacing={6} alignItems="center">
        <Link href="/" passHref scroll={false}>
          <Button m={4}>Back</Button>
        </Link>
        <Image
          priority
          width={300}
          height={300}
          src={pokemon.variants[selectedVariant].image}
          alt={longId}
        />
        <Heading textTransform="capitalize">
          {pokemon.variants[selectedVariant].name}
        </Heading>
        <HStack>
          <Button
            onClick={() => setXOrY('x')}
            isActive={xOrY === 'x'}
            p={0}
            w={8}
            h={8}
            size="xs"
            title="Version X"
            variant="ghost"
            colorScheme="blue"
            borderRadius="50%"
          >
            <MdCatchingPokemon fontSize={32} />
          </Button>
          <Button
            onClick={() => setXOrY('y')}
            isActive={xOrY === 'y'}
            p={0}
            w={8}
            h={8}
            size="xs"
            title="Version Y"
            variant="ghost"
            colorScheme="red"
            borderRadius="50%"
          >
            <MdCatchingPokemon fontSize={32} />
          </Button>
        </HStack>
        <Text textAlign="center" px={5}>
          {xOrY === 'x'
            ? pokemon.variants[selectedVariant].descriptionX
            : pokemon.variants[selectedVariant].descriptionY}
        </Text>
        {pokemon.variants.length > 1 && (
          <FormControl maxW={350}>
            <FormLabel>Variants</FormLabel>
            <Select
              onChange={e => {
                setSelectedVariant(e.currentTarget.value as any)
              }}
            >
              {pokemon.variants.map(({ name }, index) => (
                <option key={name} value={index}>
                  {name}
                </option>
              ))}
            </Select>
          </FormControl>
        )}
        <Box
          p={2}
          fontSize="md"
          fontWeight={300}
          bgColor="blackAlpha.200"
          borderRadius={10}
        >
          {/* <Box mb={2}>Types</Box> */}
          <PokemonTypes types={pokemon.type} />
        </Box>

        <Box
          p={2}
          fontSize="md"
          fontWeight={300}
          color="gray.800"
          bgColor="red.200"
          borderRadius={10}
        >
          {/* <Box mb={2}>Weak Against</Box> */}
          <PokemonTypes types={pokemon.weakness.map(i => i.toLowerCase())} />
        </Box>
      </Stack>
    </Box>
  )
}

export default PokemonDetail
