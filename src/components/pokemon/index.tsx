import { Box, Flex, Heading, HStack, Stack } from '@chakra-ui/react'
import { MdCatchingPokemon } from 'react-icons/md'
import Icon from '@components/icon'
import MotionBox from '@components/motion-box'
import { pokemonTypeData } from '@data/pokemon-types'
import { memo } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useLocalStorage } from 'react-use'

const Pokemon = memo(({ pokemon }: { pokemon: Pokemon }) => {
  const router = useRouter()
  const [previousPokemonId, setPreviousPokemonId] = useLocalStorage<Pokemon['id'] | null>('previous', null)
  const primaryType = pokemonTypeData[pokemon.type[0]]
  const secondaryType = pokemonTypeData[pokemon.type[1]] || null
  

  const props = !!secondaryType
    ? {
        bgGradient: `linear(to-bl, ${primaryType.secondary}, ${secondaryType.secondary})`,
      }
    : {
        bgColor: primaryType.secondary,
      }

  return (
    <MotionBox
      h={300}
      w="100%"
      pb={4}
      zIndex={1}
      boxShadow="sm"
      cursor="pointer"
      borderRadius={10}
      overflow="hidden"
      position="relative"
      display="grid"
      alignItems="center"
      justifyContent="center"
      whileHover="hover"
      whileTap={{ scale: 0.95 }}
      gridTemplateRows="1fr auto"
      onTap={() => {
        setPreviousPokemonId(pokemon.id)
        router.push(`/pokemon/${pokemon.id}`)
      }}
      {...props}
    >
      <TopLeftAccent {...{ primaryType, secondaryType }} />
      <BottomRightAccent {...{ primaryType }} />
      <PokemonImage
        image={pokemon.ThumbnailImage}
        alt={pokemon.ThumbnailAltText}
      />
      <PokemonNumber number={pokemon.number} />
      <Stack alignItems="center">
        <Heading size="md" color="gray.700" noOfLines={1}>
          {pokemon.name}
        </Heading>
        <PokemonTypes types={pokemon.type} />
      </Stack>
    </MotionBox>
  )
})

Pokemon.displayName = 'Pokemon'

export default Pokemon

const PokemonImage = ({ image, alt }: { image: string; alt: string }) => {
  const imageVariants = {
    hover: { scale: 1.1 },
  }
  return (
    <MotionBox
      zIndex={1}
      display="flex"
      alignItems="center"
      alignSelf="flex-end"
      justifyContent="center"
      filter="drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.2))"
      variants={imageVariants}
    >
      <Box w={170} h={170}>
        <Image
          priority
          width={170 * 2}
          height={170 * 2}
          quality={100}
          src={image}
          alt={alt}
        />
      </Box>
    </MotionBox>
  )
}

export const PokemonTypes = memo(({ types }: { types: string[] }) => {
  return (
    <HStack zIndex={2} spacing={2}>
      {types.map((type: any, index: number) => {
        const { icon, primary, color } = pokemonTypeData[type]
        return (
          <Box
            py={1}
            px={2}
            key={index}
            color={color}
            display="flex"
            fontWeight={700}
            bgColor={primary}
            borderRadius="20px"
            alignItems="center"
            fontSize={[10, 'xs']}
            justifyContent="center"
            textTransform="uppercase"
          >
            {typeof icon === 'function' && (
              <Box mr={1} minW="14px" maxH="14px" fontSize="14px">
                {icon()}
              </Box>
            )}
            {typeof icon === 'object' && (
              <Icon
                mr={1}
                minW="14px"
                maxH="14px"
                fixedWidth
                fontSize="14px"
                icon={icon}
              />
            )}
            <Box>{type}</Box>
          </Box>
        )
      })}
    </HStack>
  )
})

PokemonTypes.displayName = 'PokemonTypes'

const PokemonNumber = ({ number }: { number: string }) => {
  return (
    <Box
      width="100%"
      fontSize={40}
      textAlign="center"
      fontWeight="bold"
      bgClip="text"
      pos="absolute"
      top={4}
      color="blackAlpha.300"
      fontFamily="Arial"
      zIndex={0}
      sx={{
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      #{number}
    </Box>
  )
}

const TopLeftAccent = memo(
  ({
    primaryType,
    secondaryType,
  }: {
    primaryType: PokemonTypeDatum
    secondaryType: PokemonTypeDatum | null
  }) => (
    <Box
      top={-190}
      left={-190}
      zIndex={-1}
      opacity={0.2}
      fontSize={350}
      position="absolute"
      transform="rotate(180deg)"
    >
      <Box
        as={MdCatchingPokemon}
        fill={secondaryType?.primary ?? primaryType.secondary}
      />
    </Box>
  ),
)

TopLeftAccent.displayName = 'TopLeftAccent'

const BottomRightAccent = memo(
  ({ primaryType }: { primaryType: PokemonTypeDatum }) => (
    <Box
      zIndex={-1}
      right={-190}
      opacity={0.2}
      bottom={-190}
      fontSize={350}
      position="absolute"
    >
      <Box as={MdCatchingPokemon} fill={primaryType.primary} />
    </Box>
  ),
)

BottomRightAccent.displayName = 'BottomRightAccent'
