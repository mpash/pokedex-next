import {
  Box,
  Button,
  HStack,
  Heading,
  Input,
  Switch,
  Text,
} from '@chakra-ui/react'
import { PokemonCard } from '@components/pokemon-card'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import {
  faCircleG,
  faCircleH,
  faCircleM,
  faCircleP,
} from '@fortawesome/pro-solid-svg-icons'
import { faBolt, faChevronDown } from '@fortawesome/sharp-solid-svg-icons'
import usePokemonList from '@src/client/usePokemonList'
import Icon from '@src/components/icon'
import MotionBox from '@src/components/motion-box'
import MotionIcon from '@src/components/motion-icon'
import { debounce } from 'lodash/fp'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useIntersection } from 'react-use'

const Pokemon = () => {
  const router = useRouter()
  const hideVariants = router.query.hideVariants === 'true'
  const [legendCollapsed, setLegendCollapsed] = useState(false)

  const pushRouter = (value: string) => {
    router.push(
      {
        query: {
          ...router.query,
          q: value,
        },
      },
      undefined,
      { shallow: true },
    )
  }

  const debouncedRouterPush = debounce(500, pushRouter)

  return (
    <Box bgColor="gray.900" h="100svh">
      <Box
        display="grid"
        gridTemplateColumns={['auto', null, '1fr auto']}
        gridTemplateRows={['1fr auto', null, 'auto auto']}
        alignItems="flex-end"
        gridGap={6}
        color="white"
        p={['20px', '20px', '30px', '40px', '50px']}
      >
        <div>
          <Heading size="2xl" mr={6}>
            Pokédex
          </Heading>
          <Input
            size="lg"
            defaultValue={router.query.q as string}
            onChange={e => debouncedRouterPush(e.target.value)}
            onKeyDown={e => debouncedRouterPush(e.target.value)}
            variant="flushed"
            placeholder="Search the pokédex"
            borderColor="gray.400"
          />
        </div>
        <div>
          <HStack
            bgColor="gray.700"
            cursor="pointer"
            display="flex"
            justifyContent="center"
            py={1}
            borderRadius="lg"
            onClick={() => setLegendCollapsed(!legendCollapsed)}
          >
            <Heading size="sm">Legend</Heading>
            <MotionIcon
              icon={faChevronDown}
              animate={{
                rotate: legendCollapsed ? 0 : 180,
                originX: 0.5,
                originY: 0.5,
              }}
            />
          </HStack>
          <MotionBox
            display="grid"
            gridRowGap={2}
            gridColumnGap={2}
            alignItems="center"
            overflow="hidden"
            gridTemplateColumns="repeat(2, auto auto)"
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: legendCollapsed ? 0 : 1,
              height: legendCollapsed ? 0 : 'auto',
            }}
            // @ts-ignore
            transition={{ duration: 0.4 }}
          >
            <LegendItem
              icon={faCircleM}
              label="Gigantamax/Mega"
              isDisabled={hideVariants}
            />
            <LegendItem label="Variant Form" isDisabled={hideVariants}>
              <MotionIcon
                mt={2}
                size="lg"
                icon={faBolt}
                filter="drop-shadow(0 0 2px rgba(0,0,0,0.1))"
                animate={{
                  filter: [
                    'drop-shadow(0 0 2px rgba(0,0,0,0.1))',
                    'drop-shadow(0 0 2px rgba(0,0,0,0.9))',
                    'drop-shadow(0 0 2px rgba(0,0,0,0.1))',
                  ],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: 'loop',
                  ease: 'easeInOut',
                }}
              />
            </LegendItem>
            <LegendItem
              icon={faCircleG}
              label="Galarian"
              isDisabled={hideVariants}
            />
            <LegendItem
              icon={faCircleH}
              label="Hisuian"
              isDisabled={hideVariants}
            />
            <LegendItem
              icon={faCircleP}
              label="Paldean"
              isDisabled={hideVariants}
            />
            <LegendItem label="Show Variants">
              <Switch
                size="sm"
                defaultChecked={!hideVariants}
                onChange={e => {
                  router.push(
                    {
                      query: {
                        ...router.query,
                        hideVariants: !e.target.checked,
                      },
                    },
                    undefined,
                    { shallow: true },
                  )
                }}
              />
            </LegendItem>
          </MotionBox>
        </div>
      </Box>
      <PokemonList />
    </Box>
  )
}

export default Pokemon

const LegendItem = ({
  icon,
  label,
  isDisabled,
  children,
}: {
  icon?: IconProp
  label: string
  isDisabled?: boolean
  children?: React.ReactNode
}) => {
  const color = isDisabled ? 'whiteAlpha.300' : 'inherit'
  return (
    <>
      {icon ? (
        <Icon icon={icon} size="lg" color={color} />
      ) : (
        <Box color={color}>{children}</Box>
      )}
      <Text fontSize="sm" fontWeight={500} color={color}>
        {label}
      </Text>
    </>
  )
}

const PokemonList = () => {
  const router = useRouter()
  const query = (router.query.q as string) ?? ''
  const showVariants = router.query.hideVariants === 'true' ? false : true
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    isFetching,
    fetchNextPage,
    hasNextPage,
  } = usePokemonList({ query, showVariants })

  const ref = useRef<HTMLButtonElement>(null)
  const intersection = useIntersection(ref, {
    threshold: 0.1,
  })

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return
    if (intersection?.intersectionRatio ?? 1 < 1) {
      fetchNextPage()
    }
  }, [
    fetchNextPage,
    hasNextPage,
    intersection?.intersectionRatio,
    isFetchingNextPage,
  ])

  if (isLoading) return <Box>Loading...</Box>
  if (isError) return <Box>Error...</Box>

  const pokemon = data?.pages.flatMap(({ data }) => data) ?? []

  // Card size is 2.5 x 3.5 inches or 240 x 336 pixels
  // 216 x 302 pixels
  return (
    <Box overflowY="scroll" h="calc(100% - 242px)" pb={6}>
      <MotionBox color="white">
        <Box
          display="grid"
          gridAutoRows="calc(336px * 1.2)"
          justifyContent="center"
          px={['10px', null, '20px', '20px']}
          gridGap={['10px', null, '20px', '20px']}
          gridTemplateColumns="repeat(auto-fill, minmax(calc(240px * 1.2), calc(240px * 1.2)))"
        >
          {pokemon?.map(pokemon => (
            <MotionBox
              key={`pokemon-card-${pokemon.id}`}
              cursor="pointer !important"
              userSelect="none"
              layoutId={`pokemon-card-${pokemon.id}`}
            >
              <PokemonCard {...{ pokemon }} />
            </MotionBox>
          ))}
        </Box>
        {hasNextPage && (
          <Button
            ref={ref}
            w="calc(100% - var(--chakra-space-6) * 2)"
            mt={6}
            mx={6}
            size="lg"
            display="grid"
            placeItems="center"
            borderRadius="calc(336px / 30)"
            colorScheme="whiteAlpha"
            variant="ghost"
            isLoading={isFetching || isLoading}
            onClick={() => fetchNextPage()}
          >
            Load More
          </Button>
        )}
      </MotionBox>
    </Box>
  )
}
