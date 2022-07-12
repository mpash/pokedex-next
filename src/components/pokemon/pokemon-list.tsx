import { Flex } from '@chakra-ui/react'
import MotionBox from '@components/motion-box'
import Pokemon from '@components/pokemon'
import { usePagination } from '@hooks/usePagination'
import Image from 'next/image'
import { createRef, RefObject, useEffect, useState } from 'react'
import { usePokemonList } from '@components/hooks/usePokemonList'
import PaginationBar from '@components/pagination-bar'
import { debounce } from 'lodash/fp'
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

  const containerRef: RefObject<HTMLDivElement> = createRef()
  const refs: { [k: number]: RefObject<HTMLDivElement> } = pokemon.reduce(
    (acc, pokemonItem) => {
      acc[pokemonItem.id] = createRef<HTMLDivElement>()
      return acc
    },
    {},
  )

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0 })
    }
  }, [currentPage, containerRef])

  useEffect(() => {
    if (previousPokemonId && !!refs[previousPokemonId]?.current) {
      const current = refs[previousPokemonId].current
      if (current) {
        current.scrollIntoView()
        setPreviousPokemonId(null)
      }
    }
  }, [refs, previousPokemonId])

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

  if (totalPages === 0) {
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
      // onScroll={e => {
      //   // e.stopPropagation()
      // }}
      // scrollBehavior="smooth"
      // overflowX="hidden"
      drag="x"
      dragSnapToOrigin
      dragConstraints={{ left: 0, right: 0 }}
      // dragTransition={{ bounceStiffness: 900, bounceDamping: 100 }}
      // whileDrag={{ scale: 0.95 }}
      dragElastic={0}
      dragMomentum={false}
      onDragEnd={(event, info) => {
        if(info.offset.y > 0 || info.offset.y < 0) return
        if (info.offset.x < 0) {
          onNextPage()
        } else {
          onPreviousPage()
        }
      }}
      // WebkitOverflowScrolling="touch"
      sx={{
        touchAction: 'none',
        '-webkit-overflow-scrolling': 'touch',
      }}
    >
      {!!pokemon &&
        pokemon
          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
          .map((pokemon: Pokemon, index) => {
            return (
              <MotionBox
                layout
                key={pokemon.number}
                ref={refs[pokemon.id]}
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -100 }}
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
