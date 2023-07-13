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
} from '@chakra-ui/react'
import { PokemonTypes } from '@components/pokemon'
import { faArrowLeft, faTimes } from '@fortawesome/pro-solid-svg-icons'
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
import { useState } from 'react'
import { MdCatchingPokemon } from 'react-icons/md'

type PokemonDetail = Pokemon & {
  weaknessesMap: TypeWeakness
  evolutions: Pokemon[]
  types: PokemonType[]
  primaryColor: { r: number; g: number; b: number }
  weaknesses: PokemonType[]
}

const fetchPokemonDetails = async (id: string) => {
  const res = await fetch(
    new URL(
      `/api/pokemon/${id}`,
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000',
    ),
    { cache: 'force-cache' },
  )
  const data = await res.json()
  return data.data as PokemonDetail
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

  return (
    <Box
      p={10}
      minH="100svh"
      bgColor="black"
      color="whiteAlpha.900"
      backgroundSize="200% 200%"
      backgroundPosition="20% 80%"
      transition="all 2s ease-in-out"
      bgGradient={`radial(${color}, black 50%)`}
    >
      {isLoading ? (
        <Box h="100svh" display="grid" placeItems="center">
          <Spinner />
        </Box>
      ) : (
        pokemon && (
          <Stack spacing={4} alignItems="center">
            <HStack alignItems="center">
              <Link href="/pokemon" passHref>
                <Icon icon={faArrowLeft} />
              </Link>
              <Flex flexDir="column" alignItems="center">
                <div>{pokemon.number}</div>
              </Flex>
            </HStack>
            <div>{url && longId && <Image priority width={300} height={300} src={url} alt={longId} />}</div>
            <Heading>{pokemon.name}</Heading>
            <Tabs isFitted w="500px" variant="unstyled" defaultIndex={tab ? parseInt(tab) : 0}>
              <TabList>
                <Tab
                  hidden={pokemon.evolutions.filter(e => e.sourceId === pokemon.sourceId).length === 1}
                  {...{ ...tabProps, _selected }}
                >
                  Forms
                </Tab>
                <Tab {...{ ...tabProps, _selected }}>Details</Tab>
                <Tab {...{ ...tabProps, _selected }}>Types</Tab>
                <Tab {...{ ...tabProps, _selected }}>Stats</Tab>
                <Tab {...{ ...tabProps, _selected }}>Weaknesses</Tab>
                <Tab {...{ ...tabProps, _selected }}>Evolutions</Tab>
              </TabList>

              <TabPanels>
                <TabPanel display="flex" justifyContent="center">
                  <HStack>
                    {pokemon.evolutions
                      .filter(e => e.sourceId === pokemon.sourceId)
                      .map(evolution => (
                        <Link key={`form-${evolution.id}`} href={`/pokemon/${evolution.id}`} passHref>
                          <Image width={100} height={100} src={generateImageUrl(evolution)} alt={evolution.name} />
                        </Link>
                      ))}
                  </HStack>
                </TabPanel>
                <TabPanel display="flex" textAlign="center" flexDir="column" alignItems="center">
                  <HStack mb={2}>
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
                  <p>{xOrY === 'x' ? pokemon.descriptionX : pokemon.descriptionY}</p>
                </TabPanel>
                <TabPanel display="flex" justifyContent="center">
                  <PokemonTypes types={pokemon.types} />
                </TabPanel>
                <TabPanel display="flex" justifyContent="center">
                  <TabPanel display="flex" justifyContent="center" w="100%">
                    <PokemonStats pokemon={pokemon} />
                  </TabPanel>
                </TabPanel>
                <TabPanel display="flex" justifyContent="center">
                  <PokemonTypes types={pokemon.weaknesses} />
                </TabPanel>
                <TabPanel>
                  <HStack display="flex" justifyContent="center">
                    {uniqBy('sourceId', pokemon.evolutions).map(evolution => (
                      <Link
                        key={`evolution-${evolution.number}`}
                        href={`/pokemon/${evolution.id}?tab=5`}
                        shallow
                        prefetch
                      >
                        <Image width={100} height={100} src={generateImageUrl(evolution)} alt={evolution.number} />
                      </Link>
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

// const EvolutionsByNumber = () => {
//   {
//     Object.keys(evolutionsByNumber).length > 0 && (
//       <>
//         <Heading size="lg">Evolutions</Heading>
//         <Box
//           bgColor="blackAlpha.200"
//           p={10}
//           borderRadius="lg"
//           w="600px"
//           display="grid"
//           gridTemplateColumns={`repeat(${
//             Object.keys(evolutionsByNumber).length - 1
//           }, auto 1fr) 1fr`}
//           gridGap={4}
//           placeItems="center"
//         >
//           {Object.keys(evolutionsByNumber).map(number => {
//             const evolutions = evolutionsByNumber[number]
//             const isLast = number === Object.keys(evolutionsByNumber).pop()
//             return (
//               <Fragment key={number}>
//                 <Box
//                   w="100%"
//                   p={4}
//                   fontSize="md"
//                   fontWeight={300}
//                   textAlign="center"
//                   borderRadius="lg"
//                   bgColor="blackAlpha.200"
//                 >
//                   <Heading
//                     pb={1}
//                     mb={2}
//                     size="sm"
//                     borderBottomWidth={1}
//                     borderBottomColor="whiteAlpha.200"
//                   >
//                     #{number}
//                   </Heading>
//                   {evolutions.map(pokemon => {
//                     const url = generateImageUrl(pokemon)
//                     return (
//                       <Box
//                         key={pokemon.id}
//                         display="flex"
//                         alignItems="center"
//                         flexDir="column"
//                         cursor="pointer"
//                         onClick={() => router.push(`/pokemon/${pokemon.id}`)}
//                       >
//                         <Image
//                           width={80}
//                           height={80}
//                           src={url}
//                           alt={pokemon.name}
//                         />
//                         <Box fontWeight={500}>{pokemon.name}</Box>
//                       </Box>
//                     )
//                   })}
//                 </Box>
//                 {!isLast && (
//                   <Icon
//                     boxSize={8}
//                     icon={faArrowRight}
//                     color="blackAlpha.400"
//                   />
//                 )}
//               </Fragment>
//             )
//           })}
//         </Box>
//       </>
//     )
//   }
// }

const PokemonStats = ({ pokemon }: { pokemon: PokemonDetail }) => {
  const { hp, attack, defense, spAttack, spDefense, speed, weaknessesMap, types } = pokemon
  const topStats = [hp, attack, defense, spAttack, spDefense, speed].sort((a, b) => (b ?? 0) - (a ?? 0)).slice(0, 2)
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

  console.log(typeWeaknesses(types[0], types[1]))
  console.log(typeStrengths(types[0], types[1]))

  // const orderedWeaknesses = Object.keys(weaknessesMap)
  //   .sort((a, b) => weaknessesMap[b] - weaknessesMap[a])
  //   .filter(type => weaknessesMap[type] > 0)

  return (
    <Stack w="full" spacing={6}>
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
      <Heading pb={2} size="lg" borderBottomWidth={1} borderBottomColor="whiteAlpha.400">
        Type Weaknesses
      </Heading>
      <p>The effectiveness of each type on {pokemon.name}.</p>
      {/* <pre>{JSON.stringify(weaknessesMap, null, 2)}</pre> */}
      {/* <Box
        w="100%"
        gridGap={2}
        display="grid"
        justifyItems="center"
        gridTemplateColumns="repeat(auto-fill, minmax(70px, 1fr))"
      >
        {orderedWeaknesses.map(type => {
          const weaknesses = weaknessesMap[type as PokemonType]
          return (
            <Box key={type} display="flex" alignItems="center">
              <PokemonWeaknessType
                type={type as PokemonType}
                value={weaknesses}
              />
            </Box>
          )
        })}
      </Box> */}
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

const PokemonWeaknessType = ({ type, value }: { type: PokemonType; value: number | null }) => {
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
      spacing={1}
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
