import { Box, Flex } from '@chakra-ui/react'
import { usePokemonList } from '@src/components/hooks/usePokemonList_DEPRECATED'
import MotionBox from '@components/motion-box'
import Pokemon from '@components/pokemon'
import { usePagination } from '@hooks/usePagination'
import Image from 'next/image'
import { createRef, RefObject, useEffect, useMemo } from 'react'
import { useLocalStorage } from 'react-use'

const PokemonList = () => {
  const {
    currentPage,
    onPageChange,
    setTotalPages,
    itemsPerPage,
    onNextPage,
    onPreviousPage,
    containerRef,
    totalPages,
  } = usePagination()
  const { isLoading, pokemon } = usePokemonList()
  const [previousPokemonId, setPreviousPokemonId] = useLocalStorage(
    'previous',
    null,
  )

  useEffect(() => {
    setTotalPages(Math.ceil(pokemon.length / itemsPerPage))
    return () => {
      setTotalPages(0)
    }
  }, [pokemon, setTotalPages, itemsPerPage])

  const refs: { [k: number]: RefObject<HTMLDivElement> } = useMemo(() => {
    return pokemon.reduce((acc, pokemonItem) => {
      acc[pokemonItem.id] = createRef<HTMLDivElement>()
      return acc
    }, {})
  }, [pokemon])

  useEffect(() => {
    if (previousPokemonId && !!refs[previousPokemonId]?.current) {
      const current = refs[previousPokemonId].current
      if (current) {
        current.scrollIntoView()
        setPreviousPokemonId(null)
      }
    }
  }, [refs, previousPokemonId, setPreviousPokemonId])

  useEffect(() => {
    if (pokemon.length === 0) {
      onPageChange(1)
    }
  }, [pokemon, onPageChange])

  if (isLoading) {
    return (
      <Flex
        fontSize={24}
        h="100%"
        w="100%"
        flexDir="column"
        alignItems="center"
        justifyContent="center"
      >
        <Image
          alt="Loading"
          src="/img/pikachu-loading.gif"
          width={250 * 0.5}
          height={177 * 0.5}
        />
      </Flex>
    )
  }

  if (pokemon.length === 0) {
    return (
      <Flex
        fontSize={24}
        w="100%"
        h="100%"
        flexDir="column"
        alignItems="center"
        justifyContent="center"
      >
        <Image
          alt="Not found"
          src="/img/pandir-404.gif"
          width={500 * 0.4}
          height={308 * 0.4}
        />
        No results found
      </Flex>
    )
  }

  return (
    <>
      <MotionBox
        ref={containerRef}
        gridGap={4}
        pos="relative"
        display="grid"
        alignItems="flex-start"
        gridTemplateRows="300px"
        gridTemplateColumns={{
          base: 'repeat(auto-fill, minmax(170px, auto))',
          sm: 'repeat(auto-fill, minmax(220px, auto))',
        }}
        h="100%"
        overflowY="scroll"
        drag={totalPages > 1 ? 'x' : undefined}
        dragConstraints={{ left: 0, right: 0 }}
        dragSnapToOrigin
        dragElastic={0.03}
        willChange="transform"
        whileDrag={{ scale: 0.95 }}
        dragMomentum={false}
        onDragEnd={(event, info) => {
          const realY =
            info.velocity.y < 0 ? info.velocity.y * -1 : info.velocity.y
          const realX =
            info.velocity.x < 0 ? info.velocity.x * -1 : info.velocity.x
          if (realY > realX) return
          if (info.velocity.x < 0) {
            onNextPage()
          } else {
            onPreviousPage()
          }
        }}
        sx={{
          overflowScrolling: 'touch',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {!!pokemon &&
          pokemon
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((pokemon: Archive.Pokemon) => (
              <Box
                key={`${pokemon.number}-${pokemon?.fId ?? 'f1'}`}
                ref={refs[pokemon.id]}
              >
                <Pokemon pokemon={pokemon} />
              </Box>
            ))}
      </MotionBox>
    </>
  )
}

export default PokemonList
