import { Box, Flex, Heading, HStack, Stack } from '@chakra-ui/react'
import Icon from '@components/icon'
import MotionBox from '@components/motion-box'
import { pokemonTypeData } from '@data/pokemon-types'
import { usePagination } from '@hooks/usePagination'
import Image from 'next/future/image'
import { useRouter } from 'next/router'
import { memo } from 'react'
import { MdCatchingPokemon } from 'react-icons/md'
import { useLocalStorage } from 'react-use'

const Pokemon = memo(({ pokemon }: { pokemon: Pokemon }) => {
  const router = useRouter()
  const [previousPokemonId, setPreviousPokemonId] = useLocalStorage<
    Pokemon['id'] | null
  >('previous', null)
  const { currentPage } = usePagination()
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
      layout
      h={280}
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
        if (!!pokemon?.fId && pokemon?.fId !== 'f1') {
          router.push(`/pokemon/${pokemon.id}?fId=${pokemon.fId}`)
        } else {
          router.push(`/pokemon/${pokemon.id}`)
        }
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
      <Stack zIndex={1} alignItems="center" mt={2}>
        <Heading
          textAlign="center"
          size="md"
          color="gray.700"
          // noOfLines={2}
          // h="40px"
        >
          {pokemon?.originalName &&
          !pokemon.name.includes(pokemon?.originalName) ? (
            <>
              <Box as="span" pr={2}>
                {pokemon?.originalName}
              </Box>
              <br />
              <Box fontSize="sm">({pokemon.name})</Box>
            </>
          ) : (
            <>
              {pokemon.name.split('(').length > 1 ? (
                <>
                  {pokemon.name.split('(')[0]}
                  <br />
                  <Box fontSize="sm">
                    ({pokemon.name.split('(')[1].split(')')[0]})
                  </Box>
                </>
              ) : (
                pokemon.name
              )}
            </>
          )}
        </Heading>
        <PokemonTypes types={pokemon.type} />
        {/* <PokemonTypes
          size="sm"
          types={pokemon.weakness.map(w => w.toLowerCase())}
        /> */}
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
      pointerEvents="none"
      alignItems="center"
      alignSelf="flex-end"
      justifyContent="center"
      filter="drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.2))"
      variants={imageVariants}
    >
      <Image
        style={{ objectFit: 'contain', maxHeight: 150, maxWidth: 150 }}
        width={150 * 2}
        height={150 * 2}
        quality={100}
        src={image}
        alt={alt}
      />
    </MotionBox>
  )
}

export const PokemonTypes = memo(
  ({ size = 'md', types }: { size?: 'md' | 'sm'; types: string[] }) => {
    return (
      <HStack zIndex={2} spacing={2}>
        {types.map((type: any, index: number) => {
          const { icon, primary, color } = pokemonTypeData[type]
          return (
            <Box
              key={type}
              py={size === 'sm' ? 1.5 : 1}
              px={size === 'sm' ? 1.5 : 2}
              color={color}
              display="flex"
              fontWeight={700}
              bgColor={primary}
              borderRadius={size === 'sm' ? '100%' : '25px'}
              alignItems="center"
              fontSize={size === 'md' ? 'xs' : '8px'}
              // fontSize={[10, 'xs']}
              justifyContent="center"
              textTransform="uppercase"
              title={type}
            >
              {/* {typeof icon === 'function' && (
                <Box mr={1} minW="14px" maxH="14px" fontSize="14px">
                  {icon()}
                </Box>
              )} */}
              {typeof icon === 'object' && (
                <Icon
                  mr={size === 'sm' ? 0 : 1}
                  minW={size === 'md' ? '14px' : '12px'}
                  maxH={size === 'md' ? '14px' : '12px'}
                  fixedWidth
                  fontSize={size === 'md' ? '14px' : '12px'}
                  icon={icon}
                />
              )}
              <Box hidden={size === 'sm'}>{type}</Box>
            </Box>
          )
        })}
      </HStack>
    )
  },
)

PokemonTypes.displayName = 'PokemonTypes'

const PokemonNumber = ({ number }: { number: string }) => {
  return (
    <Box
      fontSize={50}
      fontWeight="black"
      // bgClip="text"
      pos="absolute"
      // whiteSpace="nowrap"
      top={0}
      right={3}
      color="blackAlpha.200"
      // textShadow="0px 0px 10px rgba(0, 0, 0, 0.1)"
      fontFamily="Arial"
      zIndex={0}
      // transform="rotate(45deg)"
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
