import type { Pokemon as TPokemon } from '@api/pokemon'
import {
  Box,
  Flex,
  Heading,
  HStack,
  Stack,
  Text,
  Tooltip,
} from '@chakra-ui/react'
import {
  faCircleA,
  faCircleG,
  faCircleH,
  faCircleM,
  faCircleP,
} from '@fortawesome/pro-solid-svg-icons'
import { faBolt } from '@fortawesome/sharp-solid-svg-icons'
import Icon from '@src/components/icon'
import MotionBox from '@src/components/motion-box'
import MotionIcon from '@src/components/motion-icon'
import { pokemonTypeData } from '@src/data/pokemon-types'
import { getContrast } from '@src/utils/color'
import { capitalize } from 'lodash'
import Image from 'next/image'
import { useRef } from 'react'

// TODO: Starter selector pokemon minigame (like in the games), where the user picks from a generation they like (sorted by console icon and release date)
export const PokemonCard = ({ pokemon }: { pokemon: TPokemon }) => {
  const file = pokemon.image.split('pokedex/full/')[1].replace('.png', '')
  const url = `/img/pokemon/webp/${file}.webp`
  const imageRef = useRef<HTMLImageElement>(null)
  const { r, g, b } = pokemon.primaryColor
  const color = `rgb(${r},${g},${b})`
  const needsLightContrast = getContrast([r, g, b]) === 'light'
  const [pokemonName, pokemonNameSubText] = pokemon.name.split('(')

  return (
    <MotionBox
      h="100%"
      pos="relative"
      borderWidth={8}
      bgColor={color}
      whileHover="hover"
      borderColor={color}
      // Radius from: https://twitter.com/ENDESGA/status/1094893284554502147/photo/1
      borderRadius="calc(336px/30)"
      color={needsLightContrast ? 'whiteAlpha.800' : 'blackAlpha.800'}
    >
      <Flex justifyContent="space-between" mx={1}>
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
        pb={3}
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
          mt={1.5}
          alignItems="center"
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
}

const TypeBadge = ({ type }: { type: PokemonType }) => {
  const { icon, component } = pokemonTypeData[type]

  return (
    <Tooltip label={capitalize(type)}>
      <>
        {component}
        {icon && <Icon icon={icon} />}
      </>
    </Tooltip>
  )
}
