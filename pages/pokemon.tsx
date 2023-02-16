import {
  Box,
  Flex,
  Heading,
  HStack,
  Stack,
  Text,
  Tooltip,
} from '@chakra-ui/react'
import Icon from '@components/icon'
import { pokemonTypeData } from '@data/pokemon-types'
import ColorThief from 'colorthief/dist/color-thief.mjs'
import { capitalize, uniqBy } from 'lodash/fp'
import Image from 'next/image'
import { memo, useEffect, useMemo, useRef, useState } from 'react'
import useSWR from 'swr'
import colorFrequency, { getImageData } from 'utils/colorFrequency'

const fetcher = async (): Promise<any[]> => {
  const res = await fetch('/api/pokemon')
  const data = await res.json()
  return data
}

const weightMap = [
  { min: 0, max: 10, label: 'Light', scale: 0.75 },
  { min: 10, max: 25, label: 'Medium', scale: 0.85 },
  { min: 25, max: 100, label: 'Heavy', scale: 1 },
]

const Pokemon = () => {
  const { data, error } = useSWR('/api/pokemon', fetcher)

  const pokemonList = uniqBy('number', data)

  return (
    <>
      {/* <Heading>Pokemon</Heading> */}
      {error && <div>Failed to load</div>}
      {!pokemonList && <div>Loading...</div>}
      <Box
        pt={10}
        gridGap={8}
        display="grid"
        overflowX="scroll"
        // bgColor="gray.700"
        justifyContent="center"
        gridTemplateColumns={{
          base: 'repeat(auto-fill, 300px)',
          lg: 'repeat(auto-fill, 340px)',
        }}
        // gridAutoFlow="column"
        // alignItems="center"
        // scrollSnapType="x mandatory"
        // scrollPadding="50%"
        // sx={{
        //   'scroll-snap-points-y': 'repeat(300px)',
        // }}
      >
        {pokemonList &&
          pokemonList
            ?.slice(0, 100)
            .map((pokemon, index) => (
              <PokemonCard key={`pokemon-card-${index}`} {...{ pokemon }} />
            ))}
      </Box>
    </>
  )
}

export default Pokemon

const TypeBadge = memo(({ type }: { type: PokemonTypes }) => {
  const { icon, primary } = pokemonTypeData[type]
  return (
    <Tooltip label={capitalize(type)}>
      <Box
        w="26px"
        h="26px"
        // borderWidth={2}
        // borderColor={pokemonTypeData[type]?.primary}
        fontSize="xs"
        fontWeight="bold"
        borderRadius={25}
        bgColor={primary}
        display="flex"
        alignItems="center"
        justifyContent="center"
        textTransform="uppercase"
        color="white"
        // color={pokemonTypeData[type]?.primary}
      >
        {typeof icon === 'object' && <Icon icon={icon} />}
        {/* {type} */}
      </Box>
    </Tooltip>
  )
})

TypeBadge.displayName = 'TypeBadge'

const getPokemonColors = async (pokemon: Pokemon, topColors = 1) => {
  const url = `/img/full-trimmed/${pokemon.number}.png`
  const data = await getImageData(url)
  return colorFrequency(data, topColors)
}

const PokemonCard = ({ pokemon }: { pokemon: Pokemon }) => {
  const primaryType = pokemonTypeData[pokemon.type[0]]
  const url = `/img/full-trimmed/${pokemon.number}.png`
  const imageRef = useRef<HTMLImageElement>(null)
  const [[r, g, b], setColor] = useState<[number, number, number]>([0, 0, 0])

  const primaryAbility = pokemon.abilities[0]

  useEffect(() => {
    if (imageRef.current?.complete) {
      const colorThief = new ColorThief()
      const colorResult = colorThief?.getColor(imageRef?.current, 10)
      setColor(colorResult)
    } else {
      imageRef.current?.addEventListener('load', () => {
        const colorThief = new ColorThief()
        const colorResult = colorThief?.getColor(imageRef?.current, 10)
        setColor(colorResult)
      })
    }
  }, [])

  const color = `rgb(${r},${g},${b})`

  const top = useMemo(() => {
    if (!imageRef.current) return 0
    if (imageRef.current.height < 80) return 100
    if (imageRef.current.height < 100) return 80
    if (imageRef.current.height < 150) return 60
    return 45
  }, [])
  // console.log({ primaryType, primaryAbility })

  // console.log()

  return (
    <Box
      borderRadius="xl"
      pos="relative"
      w={{
        base: '300px',
        lg: '340px',
      }}
      boxShadow="lg"
      borderWidth={15}
      borderColor={color}
      bgColor={color}
    >
      <HStack
        display="flex"
        justifyContent="space-between"
        pt={2}
        px={3}
        pb={8}
        bgColor="white"
        alignItems="center"
        borderRadius="10px 10px 0 0"
      >
        <Text fontSize="lg" fontFamily="mono" color="gray.600">
          #{pokemon.id.toFixed(0).padStart(3, '0')}
        </Text>
        <Flex>
          <Heading size="sm" display="flex" alignItems="center">
            {/* HP */}
            <Box as="span" fontSize="2xl" fontWeight={700} ml={2}>
              {/* {pokemon.hea} */}
            </Box>
          </Heading>
          <Tooltip label={capitalize(pokemon.type[0])}>
            <Icon icon={primaryType.icon} color={color} fontSize="20px" />
          </Tooltip>
        </Flex>
      </HStack>
      <Stack
        pl={4}
        py="45px"
        spacing={1}
        bgGradient={`linear(to-t, white, rgb(${r},${g},${b}))`}
      >
        <Heading
          size="md"
          fontWeight={700}
          zIndex={2}
          color="blackAlpha.700"
          pos="relative"
        >
          {pokemon.name}
        </Heading>
        <Heading size="sm" zIndex={2} color="blackAlpha.500" pos="relative">
          {pokemon.japaneseVariants[0].name}
        </Heading>
      </Stack>
      <Stack
        py={5}
        h="130px"
        spacing={3}
        bgColor="white"
        alignItems="center"
        justifyContent="space-between"
        borderRadius="0 0 10px 10px"
        textTransform="capitalize"
      >
        <Text fontSize="xs" textAlign="center">
          {pokemon.type[0]} Pokémon. Length: {pokemon.height}cm. Weight:{' '}
          {pokemon.weight}kg.
        </Text>
        <HStack>
          {pokemon?.type?.map(type => (
            <TypeBadge
              type={type as PokemonTypes}
              key={`type-badge-${pokemon.id}-${type}`}
            />
          ))}
        </HStack>
      </Stack>
      <Image
        ref={imageRef}
        style={{
          zIndex: 1,
          position: 'absolute',
          top,
          right: 10,
          maxHeight: '160px',
          objectFit: 'contain',
        }}
        width={180}
        height={200}
        src={url}
        alt={pokemon.ThumbnailAltText}
      />
    </Box>
  )
}
