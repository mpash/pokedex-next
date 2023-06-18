import type { Pokemon as TPokemon } from '@api/pokemon'
import { Box, Button, Heading, Input, Switch, Text } from '@chakra-ui/react'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import {
  faCircleG,
  faCircleH,
  faCircleM,
  faCircleP,
} from '@fortawesome/pro-solid-svg-icons'
import { faBolt } from '@fortawesome/sharp-solid-svg-icons'
import { useIntersectionObserver } from '@react-hookz/web'
import Icon from '@src/components/icon'
import MotionBox from '@src/components/motion-box'
import MotionIcon from '@src/components/motion-icon'
import { debounce } from 'lodash/fp'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { QueryFunction, useInfiniteQuery } from 'react-query'
import { PokemonCard } from '../src/components/pokemon-card'
import { useRouter } from 'next/router'
import { useIntersection } from 'react-use'

type ApiPokemon = {
  data: TPokemon[]
  pagination: { nextPage: string | null }
}

const fetchPokemon: QueryFunction<ApiPokemon, (string | boolean)[]> = async ({
  signal,
  pageParam,
  queryKey,
}) => {
  const url = new URL('/api/pokemon', window.location.origin)
  url.searchParams.set('pageSize', '100')

  const [_, query, showVariants] = queryKey

  if (query !== '')
    url.searchParams.append(
      'q',
      typeof query === 'string' ? query : query.toString(),
    )
  if (!showVariants) url.searchParams.append('hideVariants', 'true')

  const res = await fetch(pageParam ?? url, {
    signal,
  })
  const data = await res.json()

  if (!res.ok) throw new Error((await res.json()) ?? 'Something went wrong')

  return data
}

const Pokemon = () => {
  const router = useRouter()
  const hideVariants = router.query.hideVariants === 'true'

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
        gridTemplateColumns="1fr auto"
        alignItems="flex-end"
        gridGap={6}
        color="white"
        p={10}
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
          <Heading
            size="sm"
            textAlign="center"
            bgColor="gray.700"
            py={1}
            borderRadius="lg"
          >
            Legend
          </Heading>
          <Box
            display="grid"
            mt={2}
            gridTemplateColumns="repeat(2, auto auto)"
            alignItems="center"
            gridColumnGap={2}
            gridRowGap={2}
          >
            <LegendItem
              icon={faCircleM}
              label="Gigantamax/Mega"
              isDisabled={hideVariants}
            />
            <LegendItem label="Variant Form" isDisabled={hideVariants}>
              <MotionIcon
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
          </Box>
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
  } = useInfiniteQuery({
    queryKey: ['Pokemon', query, showVariants],
    getNextPageParam: lastPage => lastPage.pagination.nextPage,
    queryFn: fetchPokemon,
    keepPreviousData: true,
  })

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

  const containerAnimation = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.01 },
    },
  }

  const itemAnimation = {
    hidden: {
      opacity: 0,
      y: 10,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  }

  if (isLoading) return <Box>Loading...</Box>
  if (isError) return <Box>Error...</Box>

  // Card size is 2.5 x 3.5 inches or 240 x 336 pixels
  return (
    <Box overflowY="scroll" h="calc(100% - 200px)" pb={6}>
      <MotionBox color="white">
        <MotionBox
          initial="hidden"
          animate="visible"
          variants={containerAnimation}
          gridGap={[2, 4, 6]}
          px={[2, 4, 6]}
          display="grid"
          justifyContent="center"
          gridTemplateColumns="repeat(auto-fill, minmax(240px, 1fr))"
          gridAutoRows="336px"
          overflow="hidden"
        >
          {data?.pages.map(({ data }) =>
            data?.map(pokemon => (
              <MotionBox
                key={`pokemon-card-${pokemon.id}`}
                overflow="hidden"
                layoutId={`pokemon-card-${pokemon.id}`}
                variants={itemAnimation}
              >
                <PokemonCard {...{ pokemon }} />
              </MotionBox>
            )),
          )}
        </MotionBox>
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
