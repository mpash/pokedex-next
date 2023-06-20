import { Box, Button, Heading, HStack, Stack, Text } from '@chakra-ui/react'
import { PokemonTypes } from '@components/pokemon'
import { faArrowRight } from '@fortawesome/sharp-regular-svg-icons'
import Icon from '@src/components/icon'
import { useQuery } from '@tanstack/react-query'
import { groupBy } from 'lodash/fp'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'
import { MdCatchingPokemon } from 'react-icons/md'
import { Pokemon } from '../api/pokemon'
import { getContrast } from '@src/utils/color'

const PokemonDetail = () => {
  const router = useRouter()
  const id = router.query.pokemon as string
  const fId = router.query.fId as string
  const [selectedVariant, setSelectedVariant] = useState(0)
  const [xOrY, setXOrY] = useState<'x' | 'y'>('x')
  const { isLoading, data: pokemon } = useQuery(['pokemon', id], async () => {
    const res = await fetch(`/api/pokemon/${id}`)
    const data = await res.json()
    return data.data as Pokemon
  })

  useEffect(() => {
    if (!!fId) {
      setSelectedVariant(parseInt(fId?.split('f')[1]) - 1)
    }
  }, [fId])

  if (isLoading) {
    return <Heading>Loading...</Heading>
  }

  if (!pokemon) {
    return <Heading>Pokemon not found</Heading>
  }

  const url = generateImageUrl(pokemon)

  const longId = pokemon.number

  const { r, g, b } = pokemon.primaryColor
  const color = `rgb(${r}, ${g}, ${b})`

  const evolutionsByNumber = groupBy('number', pokemon.evolutions)

  const needsLightContrast = getContrast([r, g, b]) === 'light'

  return (
    <Box
      minH="100vh"
      bgColor={color}
      pb={6}
      color={needsLightContrast ? 'whiteAlpha.800' : 'blackAlpha.800'}
    >
      <Stack spacing={4} alignItems="center">
        <Link href="/pokemon" passHref scroll={false}>
          <Button m={4}>Back</Button>
        </Link>
        <Image
          priority
          width={300}
          height={300}
          // src={pokemon.variants[selectedVariant].image}
          src={url}
          alt={longId}
        />
        <Heading textTransform="capitalize">{pokemon.name}</Heading>
        <PokemonTypes types={pokemon.types} />
        <HStack>
          <Button
            onClick={() => setXOrY('x')}
            isActive={xOrY === 'x'}
            p={0}
            w={8}
            h={8}
            size="xs"
            title="Version X"
            variant="solid"
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
            variant="solid"
            colorScheme="red"
            borderRadius="50%"
          >
            <MdCatchingPokemon fontSize={32} />
          </Button>
        </HStack>
        <Text
          textAlign="center"
          p={2}
          maxW="500px"
          bgColor="blackAlpha.200"
          borderRadius="lg"
        >
          {xOrY === 'x' ? pokemon.descriptionX : pokemon.descriptionY}
        </Text>
        {/* {pokemon.variants.length > 1 && (
          <FormControl maxW={350}>
            <FormLabel>Variants</FormLabel>
            <Select
              value={selectedVariant}
              onChange={e => {
                const fId = parseInt(e.target.value) + 1
                router.push(`/pokemon/${id}?fId=f${fId}`)
              }}
            >
              {pokemon.variants.map(({ name }, index) => (
                <option key={name} value={index}>
                  {name}
                </option>
              ))}
            </Select>
          </FormControl>
        )} */}
        <Heading size="lg" color="white">
          Type{pokemon.types.length > 1 && 's'}
        </Heading>
        <Box
        // p={2}
        // fontSize="md"
        // fontWeight={300}
        // bgColor="blackAlpha.200"
        // borderRadius={10}
        ></Box>
        <Heading size="lg" color="white">
          Weaknesses
        </Heading>
        <Box
          p={2}
          fontSize="md"
          fontWeight={300}
          color="gray.800"
          bgColor="blackAlpha.400"
          borderRadius={10}
        >
          <PokemonTypes types={pokemon.weaknesses} />
        </Box>
        {Object.keys(evolutionsByNumber).length > 0 && (
          <>
            <Heading size="lg">Evolutions</Heading>
            <Box
              bgColor="blackAlpha.200"
              p={10}
              borderRadius="lg"
              w="600px"
              display="grid"
              gridTemplateColumns={`repeat(${
                Object.keys(evolutionsByNumber).length - 1
              }, auto 1fr) 1fr`}
              gridGap={4}
              placeItems="center"
            >
              {Object.keys(evolutionsByNumber).map(number => {
                const evolutions = evolutionsByNumber[number]
                const isLast = number === Object.keys(evolutionsByNumber).pop()
                return (
                  <Fragment key={number}>
                    <Box
                      w="100%"
                      p={4}
                      fontSize="md"
                      fontWeight={300}
                      textAlign="center"
                      borderRadius="lg"
                      bgColor="blackAlpha.200"
                    >
                      <Heading
                        pb={1}
                        mb={2}
                        size="sm"
                        borderBottomWidth={1}
                        borderBottomColor="whiteAlpha.200"
                      >
                        #{number}
                      </Heading>
                      {evolutions.map(pokemon => {
                        const url = generateImageUrl(pokemon)
                        return (
                          <Box
                            key={pokemon.id}
                            display="flex"
                            alignItems="center"
                            flexDir="column"
                            cursor="pointer"
                            onClick={() =>
                              router.push(`/pokemon/${pokemon.id}`)
                            }
                          >
                            <Image
                              width={80}
                              height={80}
                              src={url}
                              alt={pokemon.name}
                            />
                            <Box fontWeight={500}>{pokemon.name}</Box>
                          </Box>
                        )
                      })}
                    </Box>
                    {!isLast && (
                      <Icon
                        boxSize={8}
                        icon={faArrowRight}
                        color="blackAlpha.400"
                      />
                    )}
                  </Fragment>
                )
              })}
            </Box>
          </>
        )}
        {/* <Box p={10} fontSize="xs">
          <pre>
            {JSON.stringify(groupBy('number', pokemon.evolutions), null, 2)}
          </pre>
        </Box> */}
        {/* {pokemon.evolutions?.map(pokemon => (
          <Box as="pre" key={pokemon.id}>
            {JSON.stringify(pokemon, null, 2)}
          </Box>
        ))} */}
      </Stack>
    </Box>
  )
}

export default PokemonDetail

function generateImageUrl(pokemon: Pokemon) {
  const file = pokemon.image.split('pokedex/full/')[1].replace('.png', '')
  const url = `/img/pokemon/webp/${file}.webp`
  return url
}
