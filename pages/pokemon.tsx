import type { Pokemon as TPokemon } from '@api/pokemon'
import {
  Box,
  Button,
  Flex,
  forwardRef,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
  Tooltip,
} from '@chakra-ui/react'
import { pokemonTypeData } from '@data/pokemon-types'
import {
  faCircleA,
  faCircleG,
  faCircleH,
  faCircleM,
  faCircleP,
} from '@fortawesome/pro-solid-svg-icons'
import { faBolt } from '@fortawesome/sharp-solid-svg-icons'
import { useIntersectionObserver } from '@react-hookz/web'
import Icon from '@src/components/icon'
import MotionBox, { MotionBoxProps } from '@src/components/motion-box'
import MotionIcon from '@src/components/motion-icon'
import { getContrast } from '@src/utils/color'
import { motion } from 'framer-motion'
import { capitalize, debounce } from 'lodash/fp'
import Image from 'next/image'
import { memo, useEffect, useRef, useState } from 'react'
import { QueryFunction, useInfiniteQuery } from 'react-query'

type ApiPokemon = {
  data: TPokemon[]
  pagination: { nextPage: string | null }
}

const fetchPokemon: QueryFunction<ApiPokemon, string[]> = async ({
  signal,
  pageParam,
  queryKey,
}) => {
  const url = new URL('/api/pokemon', process.env.NEXT_PUBLIC_HOSTED_URL)
  url.searchParams.set('pageSize', '100')

  const [_, query] = queryKey

  if (query !== '') url.searchParams.append('q', query)

  const res = await fetch(pageParam ?? url, {
    signal,
  })
  const data = await res.json()

  if (!res.ok) throw new Error((await res.json()) ?? 'Something went wrong')

  return data
}

const Pokemon = () => {
  const [query, setQuery] = useState('')

  return (
    <Box bgColor="gray.900" h="100svh" pb={8} overflow="hidden">
      <Box
        h="202px"
        p={8}
        display="grid"
        gridTemplateColumns="1fr auto"
        gridGap={10}
        color="white"
      >
        <Box w="100%" alignSelf="flex-end" display="flex">
          <Heading size="2xl" mr={6}>
            Pokédex
          </Heading>
          <Input
            onChange={debounce(500, e => setQuery(e.target.value))}
            variant="flushed"
            placeholder="Search the pokédex"
            borderColor="gray.400"
            _placeholder={{
              fontWeight: 400,
              color: 'gray.600',
              fontSize: '2xl',
            }}
          />
        </Box>
        <div>
          <Heading
            size="sm"
            textAlign="center"
            bgColor="gray.700"
            py={2}
            borderRadius="md"
          >
            Legend
          </Heading>
          <Box
            display="grid"
            mt={4}
            // color="gray.800"
            gridTemplateColumns="repeat(2, auto 1fr)"
            alignItems="center"
            gridColumnGap={2}
            gridRowGap={3}
          >
            <Icon icon={faCircleM} size="lg" />
            <Text fontSize="sm" fontWeight={500} color="gray.400">
              Gigantamax/Mega
            </Text>
            <MotionIcon
              size="lg"
              icon={faBolt}
              filter="drop-shadow(0 0 2px rgba(0,0,0,0.1))"
              animate={{
                filter: [
                  'drop-shadow(0 0 2px rgba(0,0,0,0.1))',
                  'drop-shadow(0 0 2px rgba(0,0,0,0.9))',
                  'drop-shadow(0 0 2px rgba(0,0,0,0.1))',
                ],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: 'loop',
                ease: 'easeInOut',
              }}
            />
            <Text fontSize="sm" fontWeight={500} color="gray.400">
              Variant Form
            </Text>
            <Icon icon={faCircleA} size="lg" />
            <Text fontSize="sm" fontWeight={500} color="gray.400">
              Alolan
            </Text>
            <Icon icon={faCircleG} size="lg" />
            <Text fontSize="sm" fontWeight={500} color="gray.400">
              Galarian
            </Text>
            <Icon icon={faCircleH} size="lg" />
            <Text fontSize="sm" fontWeight={500} color="gray.400">
              Hisuian
            </Text>
            <Icon icon={faCircleP} size="lg" />
            <Text fontSize="sm" fontWeight={500} color="gray.400">
              Paldean
            </Text>
          </Box>
        </div>
      </Box>

      <PokemonList query={query} />
    </Box>
  )
}

export default Pokemon

const PokemonList = ({ query = '' }) => {
  const [numCompleteAnimations, setNumCompleteAnimations] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const ref = useRef<HTMLButtonElement>(null)
  const intersect = useIntersectionObserver(ref, {
    root: rootRef.current,
    rootMargin: '500px',
  })

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    isFetching,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['Pokemon', query],
    getNextPageParam: lastPage => lastPage.pagination.nextPage,
    queryFn: fetchPokemon,
    keepPreviousData: true,
  })

  useEffect(() => {
    if (intersect?.isIntersecting && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [fetchNextPage, intersect?.isIntersecting, isFetchingNextPage])

  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  }

  const itemAnimation = {
    hidden: {
      opacity: 0,
      y: 10,
    },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
      },
    }),
  }

  if (isLoading) return <Box>Loading...</Box>
  if (isError) return <Box>Error...</Box>

  return (
    <Box
      ref={rootRef}
      overflowY="scroll"
      h="calc(100% - 202px)"
      scrollBehavior="smooth"
      sx={{ scrollSnapType: 'y proximity' }}
    >
      <MotionBox color="white">
        <MotionBox
          initial="hidden"
          animate="visible"
          variants={containerAnimation}
          gridGap={8}
          display="grid"
          justifyContent="center"
          gridTemplateColumns={{
            base: 'repeat(auto-fill, 280px)',
          }}
        >
          {data?.pages.map(({ data }, page) =>
            data?.map((pokemon, index) => (
              <motion.div
                key={`pokemon-card-${pokemon.id}`}
                layoutId={`pokemon-card-${pokemon.id}`}
                variants={itemAnimation}
                custom={index + page * 30 - numCompleteAnimations}
                onAnimationEnd={() =>
                  setNumCompleteAnimations(prev => prev + 1)
                }
              >
                <PokemonCard {...{ pokemon }} />
              </motion.div>
            )),
          )}
          {hasNextPage && (
            <Button
              ref={ref}
              mt="calc(50% + 40px / 2)"
              w="100px"
              mx="auto"
              colorScheme="cyan"
              variant="outline"
              isLoading={isFetching}
              onClick={() => fetchNextPage()}
            >
              Load More
            </Button>
          )}
        </MotionBox>
      </MotionBox>
    </Box>
  )
}

const TypeBadge = memo(({ type }: { type: PokemonType }) => {
  const { icon, component } = pokemonTypeData[type]

  return (
    <Tooltip label={capitalize(type)}>
      <>
        {component}
        {icon && <Icon icon={icon} />}
      </>
    </Tooltip>
  )
})

TypeBadge.displayName = 'TypeBadge'

const PokemonCard = forwardRef<
  { pokemon: TPokemon } & MotionBoxProps,
  typeof MotionBox
>(({ pokemon, ...rest }, ref) => {
  const file = pokemon.image.split('pokedex/full/')[1].replace('.png', '')
  const url = `/img/pokemon/webp/${file}.webp`
  const imageRef = useRef<HTMLImageElement>(null)
  const { r, g, b } = pokemon.primaryColor
  const color = `rgb(${r},${g},${b})`
  const needsLightContrast = getContrast([r, g, b]) === 'light'
  const [pokemonName, pokemonNameSubText] = pokemon.name.split('(')

  return (
    <MotionBox
      ref={ref}
      pos="relative"
      borderWidth={10}
      borderRadius="md"
      borderColor={color}
      bgColor={color}
      color={needsLightContrast ? 'whiteAlpha.800' : 'blackAlpha.800'}
      whileHover="hover"
    >
      <Flex justifyContent="space-between" mb={1}>
        <Heading fontSize="xl" fontWeight={700} noOfLines={1}>
          {pokemonName
            .replace('Gigantamax ', '')
            .replace('Mega ', '')
            .replace('Alolan ', '')
            .replace('Galarian ', '')
            .replace('Hisuian ', '')
            .replace('Paldean ', '')}
          {(pokemonName.startsWith('Gigantamax') ||
            pokemonName.startsWith('Mega')) && (
            <Icon icon={faCircleM} ml={1} size="xs" />
          )}
          {pokemon.name.startsWith('Alolan') && (
            <MotionIcon ml={1} size="xs" icon={faCircleA} />
          )}
          {pokemon.name.startsWith('Galarian') && (
            <MotionIcon ml={1} size="xs" icon={faCircleG} />
          )}
          {pokemon.name.startsWith('Hisuian') && (
            <MotionIcon ml={1} size="xs" icon={faCircleH} />
          )}
          {pokemon.name.startsWith('Paldean') && (
            <MotionIcon ml={1} size="xs" icon={faCircleP} />
          )}
        </Heading>
        <Heading
          borderRadius="md"
          fontSize="xs"
          display="flex"
          alignItems="flex-end"
          alignSelf="flex-start"
          lineHeight={1.5}
        >
          HP
          <Box as="span" fontSize="2xl" fontWeight={500} ml={1} lineHeight={1}>
            {pokemon.hp}
          </Box>
        </Heading>
      </Flex>
      <Box
        pb={4}
        borderRadius="md"
        display="grid"
        gridTemplateRows="auto 1fr auto"
        borderWidth={1}
        borderColor="blackAlpha.300"
        bgGradient={[`linear(135deg, whiteAlpha.300, blackAlpha.300)`]}
        boxShadow="inset 0px 0px 4px 2px rgba(0,0,0,0.05)"
      >
        <Box
          display="flex"
          alignItems="center"
          pos="absolute"
          right={4}
          top="calc(50% - 113px / 2)"
          lineHeight={1}
          sx={{
            writingMode: 'vertical-rl',
            textOrientation: 'upright',
          }}
        >
          <Box
            fontSize={20}
            fontWeight={900}
            color={needsLightContrast ? 'whiteAlpha.400' : 'blackAlpha.400'}
          >
            数
          </Box>
          <Box fontSize={20} fontWeight={400} letterSpacing={-2}>
            {pokemon.number}
          </Box>
        </Box>
        <Heading
          mt={2}
          fontSize="sm"
          color={needsLightContrast ? 'whiteAlpha.500' : 'blackAlpha.500'}
          textAlign="center"
        >
          {pokemon.japaneseName}
        </Heading>
        <MotionBox variants={{ hover: { scale: 1.05 } }}>
          <Image
            ref={imageRef}
            style={{
              filter: needsLightContrast
                ? `drop-shadow(0px 0px 5px rgba(0,0,0,0.3))`
                : `drop-shadow(0px 0px 5px rgba(0,0,0,0.1))`,
              margin: '0 auto',
            }}
            width={175}
            height={175}
            src={url}
            alt={pokemon.name}
          />
        </MotionBox>
        <Stack
          alignItems="center"
          mt={1}
          spacing={1}
          bgColor="whiteAlpha.600"
          mx={3}
          py={2}
          borderRadius="md"
          color="blackAlpha.800"
          lineHeight={1}
        >
          <Heading size="sm" textTransform="capitalize" textAlign="center">
            {pokemon.types[0]} Pokémon
            <br />
            {pokemonNameSubText && (
              <Box as="span" fontSize="xs" mr={1}>
                ({pokemonNameSubText}
              </Box>
            )}
          </Heading>
          <Text fontSize="xs" textAlign="center">
            Height: {pokemon.height}cm. Weight: {pokemon.weight}kg.
          </Text>
          <HStack mt={1} spacing={3} color="blackAlpha.500">
            {pokemon?.types?.map(type => (
              <TypeBadge
                type={type as PokemonType}
                key={`type-badge-${pokemon.id}-${type}`}
              />
            ))}
          </HStack>
        </Stack>
        <Stack alignItems="center" pos="absolute" top="85px" right={4}>
          {pokemon.subVariant > 0 && (
            <MotionIcon
              boxSize="18px"
              icon={faBolt}
              filter="drop-shadow(0px 3px 3px rgba(0,0,0,0))"
              animate={{
                filter: [
                  'drop-shadow(0px 0px 2px rgba(0,0,0,0))',
                  needsLightContrast
                    ? 'drop-shadow(0px 0px 2px rgba(255,255,255,1))'
                    : 'drop-shadow(0px 0px 2px rgba(0,0,0,0.5))',
                  'drop-shadow(0px 0px 2px rgba(0,0,0,0))',
                ],
              }}
              transition={{ repeat: Infinity, duration: 4 }}
            />
          )}
        </Stack>
      </Box>
    </MotionBox>
  )
})
