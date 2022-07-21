import { Badge, Box, Button, Flex, Heading } from '@chakra-ui/react'
import { usePokemonList } from '@components/hooks/usePokemonList'
import Icon from '@components/icon'
import MotionBox from '@components/motion-box'
import PaginationBar from '@components/pagination-bar'
import Pokemon from '@components/pokemon'
import { pokemonTypeData } from '@data/pokemon-types'
import { faFileSearch } from '@fortawesome/pro-solid-svg-icons'
import { usePagination } from '@hooks/usePagination'
import { useSelectedPokemonTypes } from '@hooks/useSelectedPokemonTypes'
import { AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { createRef, RefObject, useEffect, useMemo, useState } from 'react'
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
      <TypeSummary />
      {!!pokemon &&
        pokemon
          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
          .map((pokemon: Pokemon, index) => {
            return (
              <Box
                key={`${pokemon.number}-${pokemon?.fId ?? 'f1'}`}
                ref={refs[pokemon.id]}
              >
                <Pokemon pokemon={pokemon} containerRef={containerRef} />
              </Box>
            )
          })}
      <PaginationBar />
    </MotionBox>
  )
}

export default PokemonList

type PokemonTypeCounts =
  | {
      [k in PokemonTypes]: number
    }
  | {}

const TypeSummary = () => {
  const { pokemon } = usePokemonList()
  const { typeSummaryIsVisible } = useSelectedPokemonTypes()
  const [thisPageOnly, setThisPageOnly] = useState(false)
  const { currentPage, itemsPerPage } = usePagination()

  // count the number of types for all pokemon
  const typeCounts = useMemo(() => {
    const counts: PokemonTypeCounts = (
      !thisPageOnly
        ? pokemon
        : pokemon.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage,
          )
    ).reduce((acc, pokemonItem) => {
      pokemonItem.type.forEach(type => {
        if (acc[type]) {
          acc[type]++
        } else {
          acc[type] = 1
        }
      })
      return acc
    }, {})
    // sort the types by count
    const sortedCounts = Object.entries<number>(counts).sort(
      (a, b) => b[1] - a[1],
    )
    return sortedCounts
  }, [currentPage, itemsPerPage, pokemon, thisPageOnly])

  if (!typeSummaryIsVisible) return null

  return (
    <Flex
      fontSize={24}
      w="100%"
      h="100%"
      flexDir="column"
      overflowY="scroll"
      pos="relative"
      borderWidth={3}
    >
      <Flex
        top={0}
        p={2}
        pos="sticky"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
        bgColor="gray.100"
        zIndex={2}
      >
        <Heading size="sm" color="gray.600">
          Type Summary
        </Heading>
        <Button
          size="xs"
          title="Summarize only this page"
          isActive={thisPageOnly}
          onClick={() => setThisPageOnly(!thisPageOnly)}
        >
          <Icon icon={faFileSearch} />
        </Button>
      </Flex>
      <Box px={2}>
        <AnimatePresence>
          {typeCounts.map(([type, count]) => (
            <MotionBox
              layout
              key={type}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <TypeSummaryItem
                type={type}
                count={count}
                max={typeCounts[0][1]}
              />
            </MotionBox>
          ))}
        </AnimatePresence>
      </Box>
    </Flex>
  )
}

const TypeSummaryItem = ({ type, count, max }) => {
  const primaryType = pokemonTypeData[type]

  const tweenBetween = (beg, end, cur, max) => beg + (cur / max) * (end - beg)

  const width = Math.floor(tweenBetween(1, 100, count, max))

  return (
    <Box
      display="grid"
      gridColumnGap={1}
      alignItems="center"
      gridTemplateRows="24px"
      gridTemplateColumns="minmax(90px, auto) 1fr"
    >
      <Flex
        fontSize={14}
        fontWeight={700}
        alignItems="center"
        textTransform="uppercase"
        color={primaryType.primary}
      >
        <Icon mr={1} w="14px" h="14px" icon={primaryType.icon} />
        {type}
      </Flex>
      <Box pos="relative" mr={6}>
        <MotionBox
          layout
          h={1}
          w={`${width}%`}
          borderRadius={25}
          bgColor={primaryType.primary}
        />
        <Box
          pos="absolute"
          w="100%"
          h={1}
          top={0}
          borderRadius={25}
          bgColor="blackAlpha.100"
          zIndex={-1}
        />
        <Badge
          as={MotionBox}
          layout
          pos="absolute"
          top="-7px"
          left={`${width - 10}%`}
          bgColor={primaryType.primary}
          color={primaryType.secondary}
          borderRadius={25}
        >
          {count}
        </Badge>
      </Box>
    </Box>
  )
}
