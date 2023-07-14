import { PokemonListItem } from '@/pages/api/pokemon'
import { Box, Flex, Heading, HStack, Stack, Text, Tooltip, usePrevious } from '@chakra-ui/react'
import { faCircleA, faCircleG, faCircleH, faCircleM, faCircleP } from '@fortawesome/pro-solid-svg-icons'
import { faBolt } from '@fortawesome/sharp-solid-svg-icons'
import pokeballIcon from '@public/img/pokeball.png'
import pokemonLogo from '@public/img/pokemon-logo.svg'
import Icon from '@src/components/icon'
import MotionBox from '@src/components/motion-box'
import MotionIcon from '@src/components/motion-icon'
import { pokemonTypeData } from '@src/data/pokemon-types'
import { getContrast } from '@src/utils/color'
import { AnimatePresence } from 'framer-motion'
import { capitalize } from 'lodash'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { memo, useMemo, useRef, useState } from 'react'

// TODO: Starter selector pokemon minigame (like in the games), where the user picks from a generation they like (sorted by console icon and release date)
export const PokemonCard = ({ pokemon }: { pokemon: PokemonListItem }) => {
  const file = pokemon.image.split('pokedex/full/')[1].replace('.png', '')
  const url = `/img/pokemon/webp/${file}.webp`
  const imageRef = useRef<HTMLImageElement>(null)
  const { r, g, b } = pokemon.primaryColor
  const color = `rgb(${r},${g},${b})`
  const needsLightContrast = getContrast([r, g, b]) === 'light'
  const [flipped, setFlipped] = useState(false)

  const pokemonName = useMemo(() => {
    const result = pokemon.name
      .replace('Gigantamax ', '')
      .replace('Mega ', '')
      .replace(' (Standard Mode)', '')
      .replace('(Alolan Form)', '')
      .replace(' Breed)', ')')
      .replace(' Forme', '')
      .replace(' Form', '')
      .replace(' Pattern', '')
      .replace(' Plumage', '')
      .replace(' Style', '')
      .replace('Alolan ', '')
      .replace('Galarian ', '')
      .replace('Hisuian ', '')
      .replace('Paldean ', '')
      .replace('(Male)', '♂')
      .replace('Male', '♂')
      .replace('(Female)', '♀')
      .replace('Female', '♀')
      .trim()

    if (result.startsWith('♂ ')) return `${result.replace('♂ ', '')} ♂`

    if (result.startsWith('♀ ')) return `${result.replace('♀ ', '')} ♀`

    if (result.startsWith('Two-Segment')) return `${result.replace('Two-Segment ', '')} (2-Segment)`

    if (result.startsWith('Three-Segment')) return `${result.replace('Three-Segment ', '')} (3-Segment)`

    return result
  }, [pokemon.name])

  const [mainName, subText] = pokemonName.split('(')

  const prevFlipped = usePrevious(flipped)
  const router = useRouter()

  return (
    <MotionBox
      h="100%"
      pos="relative"
      borderWidth={8}
      bgColor={color}
      whileHover="hover"
      whileTap="tap"
      borderColor={color}
      borderRadius="calc(336px/30)" // Radius from: https://twitter.com/ENDESGA/status/1094893284554502147/photo/1
      onTap={() => {
        router.push(`/pokemon/${pokemon.id}`, undefined, { shallow: true })
      }}
      color={needsLightContrast ? 'whiteAlpha.800' : 'blackAlpha.800'}
      animate={flipped ? 'flipped' : 'default'}
      initial="default"
      variants={{
        tap: {
          scale: 0.98,
        },
        default: {
          rotateY: 0,
          scale: prevFlipped ? [1, 1.1, 1] : 1,
          zIndex: 0,
          boxShadow: 'none',
          transition: { duration: 0.3 },
          borderColor: color,
          backgroundColor: color,
        },
        flipped: {
          rotateY: 180,
          scale: [1, 1.1, 1],
          zIndex: 10,
          boxShadow: 'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
          transition: { duration: 0.3 },
          borderColor: [color, '#001d79'],
          backgroundColor: [color, '#1b3d94'],
        },
      }}
    >
      <AnimatePresence mode="wait">
        <MotionBox
          key={`${pokemon.id}-${flipped ? 'selected' : 'unselected'}`}
          h="100%"
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
        >
          {flipped ? (
            <PokemonCardBack />
          ) : (
            <>
              <Flex justifyContent="space-between" mx={1} alignItems="flex-end">
                <Heading fontSize="lg" fontWeight={700} noOfLines={1}>
                  {mainName}
                  {subText && (
                    <Box as="span" fontSize="xs">
                      ({subText}
                    </Box>
                  )}

                  {(pokemon.name.includes('Gigantamax') || pokemon.name.includes('Mega')) && (
                    <Icon icon={faCircleM} ml={1} size="xs" />
                  )}
                  {pokemon.name.includes('Alolan') && <MotionIcon ml={1} size="xs" icon={faCircleA} />}
                  {pokemon.name.includes('Galarian') && <MotionIcon ml={1} size="xs" icon={faCircleG} />}
                  {pokemon.name.includes('Hisuian') && <MotionIcon ml={1} size="xs" icon={faCircleH} />}
                  {pokemon.name.includes('Paldean') && <MotionIcon ml={1} size="xs" icon={faCircleP} />}
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
              <MotionBox
                pb={[1, null, 3]}
                h="calc(100% - 30px)"
                borderRadius="md"
                display="grid"
                gridTemplateRows="auto 1fr auto"
                borderWidth={1}
                borderColor="blackAlpha.50"
                overflow="hidden"
                bgGradient={[`linear(-135deg, whiteAlpha.300 0%, blackAlpha.300 90%)`]}
                bgSize="200% 200%"
                whileHover={{ backgroundPosition: '50% 0%' }}
                boxShadow="inset 1px -1px 4px 2px rgba(0,0,0,0.1)"
              >
                <Box
                  display="flex"
                  alignItems="center"
                  pos="absolute"
                  right={3}
                  top="calc(50% - 102px / 2)"
                  lineHeight={1}
                  sx={{
                    writingMode: 'vertical-rl',
                    textOrientation: 'upright',
                  }}
                >
                  <Box
                    fontSize={14}
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
                <MotionBox variants={{ hover: { scale: 1.03 } }} mx="auto" mt={3}>
                  <Image
                    ref={imageRef}
                    style={{
                      filter: needsLightContrast
                        ? `drop-shadow(0px 0px 5px rgba(0,0,0,0.3))`
                        : `drop-shadow(0px 0px 5px rgba(0,0,0,0.1))`,
                    }}
                    width={200}
                    height={200}
                    src={url}
                    alt={pokemon.name}
                  />
                </MotionBox>
                <Stack
                  alignItems="center"
                  // spacing={1}
                  bgColor="blackAlpha.300"
                  mx={[1, null, 3]}
                  p={[1, null, 3]}
                  borderRadius="md"
                  color="whiteAlpha.800"
                  lineHeight={1}
                >
                  <HStack spacing={2}>
                    {pokemon?.types?.map(type => (
                      <TypeBadge type={type as PokemonType} key={`type-badge-${pokemon.id}-${type}`} />
                    ))}
                  </HStack>
                  <Heading size="sm" textTransform="capitalize" textAlign="center">
                    {pokemon.types[0]} Pokémon
                  </Heading>
                  <Text fontSize="xs" textAlign="center" noOfLines={1}>
                    Height: {pokemon.height}cm. Weight: {pokemon.weight}kg.
                  </Text>
                </Stack>
                <Stack alignItems="center" pos="absolute" top="120px" right={3.5}>
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
              </MotionBox>
            </>
          )}
        </MotionBox>
      </AnimatePresence>
    </MotionBox>
  )
}

const TypeBadge = ({ type }: { type: PokemonType }) => (
  <Tooltip label={capitalize(type)}>
    <div>{pokemonTypeData[type].icon}</div>
  </Tooltip>
)

const PokemonCardBack = memo(() => (
  <Box py={5} h="100%" display="grid" placeItems="center" transform="rotateY(180deg)">
    <Box w="75%">
      <Image src={pokemonLogo} alt="Pokemon Logo" />
    </Box>
    <Image src={pokeballIcon} alt="Pokeball" width={110} />
    <Image
      src={pokemonLogo}
      width={230}
      alt="Pokemon Logo"
      style={{
        width: '75%',
        transform: 'rotateX(180deg) rotateY(180deg)',
      }}
    />
  </Box>
))

PokemonCardBack.displayName = 'PokemonCardBack'
