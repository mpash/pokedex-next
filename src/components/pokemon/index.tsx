import { Box, Flex, Heading, HStack, Stack } from '@chakra-ui/react'
import Icon from '@components/icon'
import MotionBox from '@components/motion-box'
import { pokemonTypeData } from '@data/pokemon-types'
import { usePagination } from '@hooks/usePagination'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { memo, MutableRefObject } from 'react'
import { MdCatchingPokemon } from 'react-icons/md'
import { useLocalStorage } from 'react-use'

const Pokemon = memo(
  ({
    pokemon,
    containerRef,
  }: {
    pokemon: Pokemon
    containerRef: MutableRefObject<HTMLDivElement>
  }) => {
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

    const handleOnTap = () => {
      setPreviousPokemonId(pokemon.id)
      if (!!pokemon?.fId && pokemon?.fId !== 'f1') {
        router.push(`/pokemon/${pokemon.id}?fId=${pokemon.fId}`)
      } else {
        router.push(`/pokemon/${pokemon.id}`)
      }
    }

    return (
      <MotionBox
        layout
        h={280}
        w="100%"
        pb={4}
        zIndex={1}
        borderWidth={5}
        borderColor="blackAlpha.200"
        cursor="pointer"
        overflow="hidden"
        position="relative"
        display="grid"
        alignItems="center"
        justifyContent="center"
        whileHover="hover"
        whileTap={{ scale: 0.95 }}
        willChange="transform"
        gridTemplateRows="minmax(150px, 1fr) auto"
        onTap={handleOnTap}
        {...props}
      >
        <TopLeftAccent {...{ primaryType, secondaryType }} />
        <BottomRightAccent {...{ primaryType }} />
        <PokemonImage
          containerRef={containerRef}
          image={pokemon.ThumbnailImage}
          alt={pokemon.ThumbnailAltText}
        />
        <PokemonNumber number={pokemon.number} />
        <Stack zIndex={1} alignItems="center" mt={2}>
          <PokemonName
            name={pokemon.name}
            originalName={pokemon?.originalName}
          />
          <PokemonTypes types={pokemon.type as PokemonTypes[]} />
          {/* Weaknesses */}
          {/* <PokemonTypes
          types={pokemon.weakness.map(w => w.toLowerCase()) as PokemonTypes[]}
        /> */}
        </Stack>
      </MotionBox>
    )
  },
)

Pokemon.displayName = 'Pokemon'

export default Pokemon

const PokemonName = ({
  name,
  originalName,
}: {
  name: string
  originalName: string
}) => {
  return (
    <Heading w="100%" textAlign="center" size="md" color="gray.700" maxW={210}>
      {originalName && !name.includes(originalName) ? (
        <>
          <Box as="span">{originalName}</Box>
          <br />
          <Box fontSize="sm">({name})</Box>
        </>
      ) : (
        <>
          {name.split('(').length > 1 ? (
            <>
              {name.split('(')[0]}
              <br />
              <Box fontSize="sm">({name.split('(')[1].split(')')[0]})</Box>
            </>
          ) : (
            name
          )}
        </>
      )}
    </Heading>
  )
}

const PokemonImage = ({
  image,
  alt,
  containerRef,
}: {
  image: string
  alt: string
  containerRef: MutableRefObject<HTMLDivElement>
}) => {
  return (
    <MotionBox
      zIndex={1}
      display="flex"
      alignSelf="flex-end"
      justifyContent="center"
      pointerEvents="none"
      // willChange="transform"
      // maxH={150}
      variants={{
        hover: { scale: 1.1 },
      }}
    >
      <Image
        lazyRoot={containerRef}
        // priority
        alt={alt}
        src={image}
        width={200}
        height={150}
        quality={10}
        objectFit="contain"
      />
    </MotionBox>
  )
}

export const PokemonTypes = memo(({ types }: { types: PokemonTypes[] }) => {
  return (
    <HStack zIndex={2} spacing={2}>
      {types.map((type: PokemonTypes) => (
        <PokemonType key={type} type={type} />
      ))}
    </HStack>
  )
})

PokemonTypes.displayName = 'PokemonTypes'

const PokemonType = memo(({ type }: { type: PokemonTypes }) => {
  const { icon, primary, color } = pokemonTypeData[type]
  return (
    <Box
      py={1}
      px={2}
      color={color}
      display="flex"
      fontWeight={700}
      bgColor={primary}
      borderRadius={25}
      alignItems="center"
      fontSize="10px"
      justifyContent="center"
      textTransform="uppercase"
      title={type}
    >
      {typeof icon === 'object' && (
        <Icon mr={1} minW="14px" h="14px" icon={icon} />
      )}
      <Box>{type}</Box>
    </Box>
  )
})

PokemonType.displayName = 'PokemonType'

const PokemonNumber = ({ number }: { number: string }) => {
  return (
    <Box
      fontSize={50}
      fontWeight="black"
      pos="absolute"
      top={0}
      right={3}
      color="blackAlpha.200"
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
