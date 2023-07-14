import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  TabProps,
  Tabs,
  Text,
} from '@chakra-ui/react'
import { faArrowLeft, faArrowRight, faTimes } from '@fortawesome/pro-solid-svg-icons'
import { Pokemon } from '@prisma/client'
import Icon from '@src/components/icon'
import MotionBox from '@src/components/motion-box'
import { pokemonTypeData } from '@src/data/pokemon-types'
import { typeStrengths, TypeWeakness, typeWeaknesses } from '@src/data/typeCalculator'
import { useQuery } from '@tanstack/react-query'
import { uniqBy } from 'lodash/fp'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { MdCatchingPokemon } from 'react-icons/md'

type IPokemonDetail = Pokemon & {
  weaknessesMap: TypeWeakness
  evolutions: Pokemon[]
  types: PokemonType[]
  primaryColor: { r: number; g: number; b: number }
  weaknesses: PokemonType[]
}

const fetchPokemonDetails = async (id: string) => {
  const res = await fetch(new URL(`/api/pokemon/${id}`, window.location.origin), { cache: 'force-cache' })
  const data = await res.json()
  return data.data as IPokemonDetail
}

const PokemonDetail = () => {
  const router = useRouter()
  const id = router.query.pokemon as string
  const tab = router.query.tab as string
  const [xOrY, setXOrY] = useState<'x' | 'y'>('x')
  const { isLoading, data: pokemon } = useQuery({
    queryKey: ['pokemon', id],
    queryFn: async () => fetchPokemonDetails(id),
    enabled: !!id,
  })

  const url = pokemon ? generateImageUrl(pokemon) : undefined

  const longId = pokemon?.number

  const { r, g, b } = pokemon ? pokemon.primaryColor : { r: 0, g: 0, b: 0 }
  const color = `rgb(${r}, ${g}, ${b})`

  const tabProps: TabProps = {
    display: 'flex',
    flexDir: 'column',
    alignItems: 'center',
    color: 'whiteAlpha.800',
    _after: {
      content: '""',
      display: 'block',
      borderRadius: 'full',
      w: 8,
      h: 1,
      mt: 1,
      bgColor: 'transparent',
      transition: 'all 0.2s ease-in-out',
    },
  }

  const _selected: TabProps = {
    color: 'white',
    _after: { bgColor: 'white' },
  }

  const hasMultipleForms = useMemo(() => {
    const forms = pokemon?.evolutions.filter(e => e.sourceId === pokemon.sourceId)
    if (!forms) return false
    return forms.length > 1
  }, [pokemon])

  return (
    <Box
      py={[2, null, 10]}
      minH="100svh"
      bgColor="black"
      color="whiteAlpha.900"
      backgroundSize="200% 200%"
      backgroundPosition="20% 80%"
      bgGradient={`radial(${color}, black 50%)`}
    >
      {isLoading ? (
        <Box h="100svh" display="grid" placeItems="center">
          <Spinner />
        </Box>
      ) : (
        pokemon && (
          <Stack spacing={4} alignItems="center" overflow="hidden">
            <HStack alignItems="center">
              <Link href="/pokemon" shallow>
                <Icon icon={faArrowLeft} />
              </Link>
              <Flex flexDir="column" alignItems="center">
                <div>{pokemon.number}</div>
              </Flex>
            </HStack>
            <div>{url && longId && <Image priority width={300} height={300} src={url} alt={longId} />}</div>
            <Heading>{pokemon.name}</Heading>
            <Tabs isFitted variant="unstyled" defaultIndex={tab ? parseInt(tab) : 1} w="500px">
              <TabList>
                <Tab {...{ ...tabProps, _selected }}>Details</Tab>
                <Tab {...{ ...tabProps, _selected }}>Stats</Tab>
                <Tab {...{ ...tabProps, _selected }}>Evolutions</Tab>
                <Tab hidden={!hasMultipleForms} {...{ ...tabProps, _selected }}>
                  Forms
                </Tab>
              </TabList>
              <TabPanels>
                {/* Details */}
                <TabPanel>
                  <HStack display="flex" justifyContent="center" mb={4}>
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
                      <Box as={MdCatchingPokemon} fontSize={26} />
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
                      <Box as={MdCatchingPokemon} fontSize={26} />
                    </Button>
                  </HStack>
                  <Text textAlign="center">{xOrY === 'x' ? pokemon.descriptionX : pokemon.descriptionY}</Text>
                </TabPanel>
                {/* Stats */}
                <TabPanel>
                  <PokemonStats pokemon={pokemon} />
                </TabPanel>
                {/* Evolutions */}
                <TabPanel>
                  <HStack display="flex" justifyContent="center">
                    {uniqBy('sourceId', pokemon.evolutions).map((evolution, index) => {
                      return (
                        <MotionBox
                          key={`evolution-${evolution.number}`}
                          display="flex"
                          alignItems="center"
                          _last={{ '.evolution-divider': { display: 'none' } }}
                          whileInView="whileInView"
                        >
                          <MotionBox
                            whileHover={{ scale: 1.05 }}
                            initial={{ opacity: index === 0 ? 1 : 0 }}
                            variants={{
                              whileInView: {
                                opacity: 1,
                                transition: { duration: 0.25, delay: index * 0.25 + 0.25 },
                              },
                            }}
                          >
                            <Link shallow prefetch href={`/pokemon/${evolution.id}?tab=2`}>
                              <Image
                                width={150}
                                height={150}
                                alt={evolution.number}
                                src={generateImageUrl(evolution)}
                              />
                              <Heading size="sm" mt={2} textAlign="center">
                                {evolution.name}
                                <Box as="span" fontWeight={400} color="whiteAlpha.600" ml={0.5}>
                                  #{evolution.sourceId}
                                </Box>
                              </Heading>
                            </Link>
                          </MotionBox>
                          <MotionBox
                            initial={{ opacity: 0 }}
                            variants={{
                              whileInView: {
                                opacity: 1,
                                transition: { duration: 0.25, delay: index * 0.25 + 0.25 },
                              },
                            }}
                          >
                            <Icon border="none" icon={faArrowRight} className="evolution-divider" />
                          </MotionBox>
                        </MotionBox>
                      )
                    })}
                  </HStack>
                </TabPanel>
                {/* Forms */}
                <TabPanel hidden={!hasMultipleForms}>
                  <HStack justifyContent="center" spacing={5}>
                    {pokemon.evolutions
                      .filter(e => e.sourceId === pokemon.sourceId)
                      .map(evolution => (
                        <Box key={`form-${evolution.id}`}>
                          <Link
                            href={`/pokemon/${evolution.id}?tab=3`}
                            passHref
                            shallow
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                            }}
                          >
                            <Image
                              width={100}
                              height={100}
                              alt={evolution.name}
                              src={generateImageUrl(evolution)}
                            />
                            <Heading size="xs" mt={2} textAlign="center">
                              {evolution.name}
                              <Box as="span" fontWeight={400} color="whiteAlpha.600" ml={0.5}>
                                #{evolution.sourceId}
                              </Box>
                            </Heading>
                          </Link>
                        </Box>
                      ))}
                  </HStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Stack>
        )
      )}
    </Box>
  )
}

export default PokemonDetail

function generateImageUrl(pokemon: Pokemon) {
  const file = pokemon.image.split('pokedex/full/')[1].replace('.png', '')
  const url = `/img/pokemon/webp/${file}.webp`
  return url
}

const PokemonStats = ({ pokemon }: { pokemon: IPokemonDetail }) => {
  const { hp, attack, defense, spAttack, spDefense, speed, types } = pokemon
  const topStats = [hp, attack, defense, spAttack, spDefense, speed]
    .sort((a, b) => (b ?? 0) - (a ?? 0))
    .slice(0, 2)
  const stats = [
    { label: 'HP', value: hp, max: 255 },
    { label: 'Attack', value: attack, max: 181 },
    { label: 'Defense', value: defense, max: 230 },
    { label: 'Sp. Attack', value: spAttack, max: 173 },
    { label: 'Sp. Defense', value: spDefense, max: 230 },
    { label: 'Speed', value: speed, max: 200 },
  ]
  const { r, g, b } = pokemon.primaryColor
  const color = `rgb(${r}, ${g}, ${b})`

  const weaknesses = typeWeaknesses(types[0], types[1])
  const orderedWeaknesses = Object.keys(weaknesses).sort(
    (a, b) => weaknesses[a].modifier - weaknesses[b].modifier,
  )

  const strengths = typeStrengths(types[0], types[1])
  const orderedStrengths = Object.keys(strengths).sort(
    (a, b) => strengths[a].modifier - strengths[b].modifier,
  )

  return (
    <Stack spacing={6}>
      <Box
        display="grid"
        gridTemplateColumns="auto auto 1fr"
        gridColumnGap={10}
        gridRowGap={2}
        alignItems="center"
        w="100%"
      >
        {stats.map(({ label, value, max }) => {
          const isTopStat = topStats.includes(value)
          return (
            <PokemonStat
              key={`${pokemon.id}-${label}`}
              label={label}
              value={value}
              max={max}
              color={color}
              isTopStat={isTopStat}
            />
          )
        })}
      </Box>
      <Stack spacing={4}>
        <Box textAlign="center">
          <Heading pb={1} mb={1} size="lg" borderBottomWidth={1} borderBottomColor="whiteAlpha.400">
            Type Weaknesses
          </Heading>
          <p>The effectiveness of each type on {pokemon.name}.</p>
        </Box>
        <HStack mx="auto">
          {orderedWeaknesses.map(type => {
            const values = weaknesses[type as PokemonType]
            return (
              <Box key={type} display="flex" alignItems="center">
                <PokemonStatType type={type as PokemonType} value={values.modifier} />
              </Box>
            )
          })}
        </HStack>
      </Stack>
      <Stack spacing={4}>
        <Box textAlign="center">
          <Heading
            pb={1}
            mb={1}
            size="lg"
            textAlign="center"
            borderBottomWidth={1}
            borderBottomColor="whiteAlpha.400"
          >
            Type Strengths
          </Heading>
          <p>{pokemon.name}&apos;s effectiveness on each type.</p>
        </Box>
        <HStack mx="auto">
          {orderedStrengths.map(type => {
            const values = strengths[type as PokemonType]
            return (
              <Box key={type} display="flex" alignItems="center">
                <PokemonStatType type={type as PokemonType} value={values.modifier} />
              </Box>
            )
          })}
        </HStack>
      </Stack>
    </Stack>
  )
}

const PokemonStat = ({
  label,
  value,
  color,
  max,
  isTopStat = false,
}: {
  label: string
  color: string
  max: number
  value: number | null
  isTopStat: boolean
}) => {
  return (
    <>
      <Box color={isTopStat ? 'white' : 'whiteAlpha.800'} fontWeight={isTopStat ? 500 : 300} fontSize="sm">
        {label}
      </Box>
      <Heading size="sm">{value}</Heading>
      <Box bgColor="whiteAlpha.100" w="100%" h={2.5} borderRadius="full">
        <MotionBox
          h="100%"
          borderRadius="full"
          bgColor={isTopStat ? color : 'whiteAlpha.800'}
          whileInView={{ width: `${((value ?? 0) / max) * 100}%` }}
          initial={{ width: 0 }}
          // @ts-ignore
          transition={{ duration: 0.5 }}
        />
      </Box>
    </>
  )
}

const PokemonStatType = ({ type, value }: { type: PokemonType; value: number | null }) => {
  const { icon, primary, color } = pokemonTypeData[type]
  return (
    <HStack
      py={1}
      px={2}
      color={color}
      display="flex"
      fontSize="12px"
      fontWeight={700}
      bgColor={primary}
      borderRadius={25}
      alignItems="center"
      justifyContent="center"
      textTransform="uppercase"
      title={type}
      spacing={0.25}
    >
      <Box display="flex" alignItems="center">
        {typeof icon === 'object' && icon?.icon ? <Icon minW="14px" h="14px" icon={icon} /> : icon}
      </Box>
      <Icon boxSize={2.5} icon={faTimes} />
      <div>
        {new Intl.NumberFormat('en-US', {
          style: 'decimal',
          maximumFractionDigits: 3,
        }).format(value ?? 0)}
      </div>
    </HStack>
  )
}
