import { Box, Button, Flex, HStack } from '@chakra-ui/react'
import { usePokemonList } from '@src/components/hooks/usePokemonList_DEPRECATED'
import Icon from '@components/icon'
import MotionBox from '@components/motion-box'
import {
  faDiceTwo,
  faFileSearch,
  faTimes,
} from '@fortawesome/pro-solid-svg-icons'
import { usePagination } from '@hooks/usePagination'
import { useSelectedPokemonTypes } from '@hooks/useSelectedPokemonTypes'
import { AnimatePresence, useMotionValue } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocalStorage } from 'react-use'
import { TypeSummaryItem } from './type-summary-item'

const TypeSummary = () => {
  const { pokemon } = usePokemonList()
  const { typeSummaryIsVisible, setTypeSummaryIsVisible } =
    useSelectedPokemonTypes()
  const [thisPageOnly, setThisPageOnly] = useState(false)
  const { currentPage, itemsPerPage } = usePagination()
  const ref = useRef<HTMLDivElement>()

  useEffect(() => {
    ref.current = document.querySelector('#overlay') as HTMLDivElement
  }, [])

  // count the number of types for all pokemon
  const typeCounts = useMemo(() => {
    type PokemonTypeCounts =
      | {
          [k in PokemonType]: number
        }
      | {}
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

  const typeCountsByPair = useMemo(() => {
    const typePairings = pokemon.reduce((acc, pokemonItem) => {
      const pairId = pokemonItem.type.join('-')
      if (acc[pairId]++) {
        acc[pairId]++
      } else {
        acc[pairId] = 1
      }

      return acc
    }, {})
    const sortedPairings = Object.entries<number>(typePairings).sort(
      (a, b) => b[1] - a[1],
    )
    return sortedPairings
  }, [pokemon])

  const [localX, setLocalX] = useLocalStorage('typeSummaryX', 0)
  const [localY, setLocalY] = useLocalStorage('typeSummaryY', 0)
  const x = useMotionValue(localX)
  const y = useMotionValue(localY)
  useEffect(() => x.onChange(latest => setLocalX(latest)), [setLocalX, x])
  useEffect(() => y.onChange(latest => setLocalY(latest)), [setLocalY, y])

  return ref.current
    ? createPortal(
        <MotionBox
          cursor="grab"
          whileTap={{ cursor: 'grabbing', scale: 0.95, opacity: 0.95 }}
          pos="absolute"
          willChange="transform"
          top={0}
          left={0}
          drag
          boxShadow="md"
          style={{ x, y }}
          zIndex={2}
          dragMomentum={false}
          bgColor="white"
          p={3}
          initial={{ opacity: 0 }}
          animate={typeSummaryIsVisible ? 'show' : 'hide'}
          pointerEvents={typeSummaryIsVisible ? 'auto' : 'none'}
          variants={{ show: { opacity: 1 }, hide: { opacity: 0 } }}
        >
          <Flex alignItems="center" justifyContent="space-between">
            <Box>Type Summary</Box>
            <Button size="xs" onClick={() => setTypeSummaryIsVisible(false)}>
              <Icon w="14px" h="14px" icon={faTimes} />
            </Button>
          </Flex>

          <MotionBox
            display="flex"
            fontSize={24}
            w="100%"
            h="100%"
            flexDir="column"
            overflowY="scroll"
            pos="relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <HStack my={4}>
              <Button
                size="xs"
                title="Show pairs of types"
                // isActive={thisPageOnly}
                // onClick={() => {
                //   setThisPageOnly(!thisPageOnly)
                // }}
              >
                <Icon mr={1} w="14px" h="14px" icon={faDiceTwo} />
                Show Pairs
              </Button>
              <Button
                size="xs"
                title="Summarize only this page"
                isActive={thisPageOnly}
                onClick={() => {
                  setThisPageOnly(!thisPageOnly)
                }}
              >
                <Icon mr={1} w="14px" h="14px" icon={faFileSearch} />
                This Page Only
              </Button>
            </HStack>

            <Box px={2} maxH={200} overflowY="scroll">
              <>
                {/* <Box overflowY="scroll">
                  {Object.keys(typeCountsByPair).map((pairId, index) => {
                    // const count = typeCountsByPair[pairId]
                    // const types = pairId.split('-')
                    // console.log(index, count[1])

                    return null

                    return (
                      <Box
                        display="grid"
                        gridTemplateColumns="auto 1fr"
                        key={pairId}
                      >
                        <Box justifySelf="flex-end">{count}</Box>
                      </Box>
                    )
                  })}
                </Box> */}
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
              </>
            </Box>
          </MotionBox>
        </MotionBox>,
        ref.current,
      )
    : null
}

export default TypeSummary
