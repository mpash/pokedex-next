import { Flex } from '@chakra-ui/react'
import { usePokemonList } from '@components/hooks/usePokemonList'
import MotionBox from '@components/motion-box'
import PaginationBar from '@components/pagination-bar'
import Pokemon from '@components/pokemon'
import { usePagination } from '@hooks/usePagination'
import { debounce } from 'lodash/fp'
import Image from 'next/image'
import { createRef, RefObject, useEffect, useRef } from 'react'
import { useLocalStorage } from 'react-use'

const PokemonList = () => {
  const {
    currentPage,
    totalPages,
    onPageChange,
    setTotalPages,
    itemsPerPage,
    onNextPage,
    onPreviousPage,
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

  useEffect(() => {
    if (currentPage > totalPages && totalPages !== 0) {
      onPageChange(totalPages)
    }
  }, [totalPages, currentPage, onPageChange])

  const containerRef = useRef<HTMLDivElement>(null)
  // const refs: { [k: number]: RefObject<HTMLDivElement> } = pokemon.reduce(
  //   (acc, pokemonItem) => {
  //     acc[pokemonItem.id] = createRef<HTMLDivElement>()
  //     return acc
  //   },
  //   {},
  // )
  useEffect(() => {
    if (!previousPokemonId) {
      containerRef?.current?.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  // useEffect(() => {
  //   const waitToScroll = debounce(100, () =>
  //     containerRef?.current?.scrollTo({ top: 0, behavior: 'smooth' }),
  //   )
  //   // waitToScroll()
  // }, [currentPage])

  // useEffect(() => {
  //   if (previousPokemonId && !!refs[previousPokemonId]?.current) {
  //     const current = refs[previousPokemonId].current
  //     if (current) {
  //       current.scrollIntoView()
  //       setPreviousPokemonId(null)
  //     }
  //   }
  // }, [refs, previousPokemonId, setPreviousPokemonId])

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
    <MotionBox
      ref={containerRef}
      gap={[3, 5]}
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
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0}
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
          .map((pokemon: Pokemon) => {
            return (
              <MotionBox
                layout
                key={pokemon.number}
                // ref={refs[pokemon.id]}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Pokemon pokemon={pokemon} />
              </MotionBox>
            )
          })}
      <PaginationBar />
    </MotionBox>
  )
}

export default PokemonList
