import { Box, Button, ButtonProps, HStack, Stack } from '@chakra-ui/react'
import Icon from '@components/icon'
import { faBackpack, faCardsBlank, faDna, faEgg, faMapLocationDot } from '@fortawesome/pro-duotone-svg-icons'
import PokedexV2Logo from '@src/components/PokedexV2Logo'
import { motion } from 'framer-motion'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { MdCatchingPokemon } from 'react-icons/md'

const Home: NextPage = () => {
  const router = useRouter()
  return (
    <Box pos="relative">
      <Head>
        <title>Welcome to my Pokedex</title>
        <meta name="description" content="Search for just about anything in the Pokémon universe." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box h="100svh" display="grid" placeItems="center">
        <Stack spacing={[2, 4]} p={[2, 4]} alignItems="center">
          <PokedexV2Logo size="4xl" lineHeight="1.5" letterSpacing={4} />
          <HStack>
            <BigButton
              label="Pokédex v2"
              bgColor="red.500"
              icon={MdCatchingPokemon}
              _active={{ bgColor: 'red.400' }}
              onClick={() => router.push('/pokemon')}
            />
            <BigButton
              label="Pokédex v1"
              bgColor="red.900"
              icon={MdCatchingPokemon}
              _active={{ bgColor: 'red.400' }}
              onClick={() => router.push('/type-calculator')}
            />
            <BigButton
              w="40%"
              icon={faDna}
              label="Types"
              bgColor="orange.500"
              _active={{ bgColor: 'orange.400' }}
              onClick={() => router.push('/type-chart')}
            />
            <BigButton
              hidden
              label="TCG"
              icon={faCardsBlank}
              bgColor="yellow.500"
              _active={{ bgColor: 'yellow.400' }}
            />
            <BigButton
              hidden
              label="Items"
              icon={faBackpack}
              bgColor="blue.500"
              _active={{ bgColor: 'blue.400' }}
            />
            <BigButton
              hidden
              label="Locations"
              bgColor="green.500"
              icon={faMapLocationDot}
              _active={{ bgColor: 'green.400' }}
            />
            <BigButton
              hidden
              label="Eggs"
              icon={faEgg}
              bgColor="purple.500"
              _active={{ bgColor: 'purple.400' }}
            />
          </HStack>
        </Stack>
      </Box>

      <Box as="pre" pos="fixed" bottom={0} right={0} color="gray.400" p={3}>
        v2.0.10
      </Box>
    </Box>
  )
}

export default Home

const BigButton = ({ label, icon, ...rest }: { label: string; icon: any } & ButtonProps) => {
  return (
    <Button
      as={motion.button}
      whileHover={{ scale: 1.025, transition: { duration: 0.05 } }}
      whileTap={{ scale: 0.975, transition: { duration: 0.01 } }}
      variant="unstyled"
      size="lg"
      fontSize="24px"
      pl={2}
      pr={10}
      py={10}
      fontWeight={700}
      display="flex"
      alignItems="flex-end"
      justifyContent="flex-start"
      color="white"
      pos="relative"
      textShadow="2px 2px 1px rgba(0, 0, 0, 0.1)"
      overflow="hidden"
      {...rest}
    >
      {label}
      {typeof icon === 'function' ? (
        <Box
          w="100px"
          h="100px"
          color="whiteAlpha.300"
          as={icon}
          pos="absolute"
          top={0}
          right={0}
          transform="rotate(-30deg)"
        />
      ) : (
        <Icon
          w="100px"
          h="100px"
          color="whiteAlpha.300"
          pos="absolute"
          top={0}
          right={0}
          transform="rotate(-30deg)"
          icon={icon}
        />
      )}
    </Button>
  )
}
