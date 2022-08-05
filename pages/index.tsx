import {
  Box,
  Button,
  ButtonProps,
  Heading,
  Input,
  Stack,
} from '@chakra-ui/react'
import Icon from '@components/icon'
import {
  faBackpack,
  faDna,
  faEgg,
  faFloppyDisk,
  faMapLocationDot,
} from '@fortawesome/pro-solid-svg-icons'
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
        <meta
          name="description"
          content="Search for just about anything in the Pokémon universe."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Stack spacing={[2, 4]} p={[2, 4]} alignItems="center">
        <Heading size="3xl">Pokédex</Heading>
        <Input
          borderRadius={25}
          w="500px"
          placeholder="Search Pokémon, moves, or abilities"
        />
        <Box
          w="500px"
          gridGap={[2, 4]}
          display="grid"
          gridTemplateColumns="1fr 1fr"
        >
          <BigButton
            onClick={() => router.push('/pokedex')}
            icon={MdCatchingPokemon}
            bgColor="red.500"
            _active={{
              bgColor: 'red.400',
            }}
            label="Pokédex"
          />
          <BigButton
            icon={faFloppyDisk}
            bgColor="yellow.500"
            _active={{
              bgColor: 'yellow.400',
            }}
            label="Moves"
          />
          <BigButton
            icon={faBackpack}
            bgColor="blue.500"
            _active={{
              bgColor: 'blue.400',
            }}
            label="Items"
          />
          <BigButton
            icon={faMapLocationDot}
            bgColor="green.500"
            _active={{
              bgColor: 'green.400',
            }}
            label="Locations"
          />
          <BigButton
            icon={faDna}
            bgColor="orange.500"
            _active={{
              bgColor: 'orange.400',
            }}
            label="Types"
          />
          <BigButton
            icon={faEgg}
            bgColor="purple.500"
            _active={{
              bgColor: 'purple.400',
            }}
            label="Eggs"
          />
        </Box>
      </Stack>
      <Box as="pre" pos="fixed" bottom={0} right={0} color="gray.400" p={3}>
        v0.0.0a
      </Box>
    </Box>
  )
}

export default Home

const BigButton = ({
  label,
  icon,
  ...rest
}: { label: string; icon: any } & ButtonProps) => {
  return (
    <Button
      as={motion.button}
      whileHover={{ scale: 1.025, transition: { duration: 0.05 } }}
      whileTap={{ scale: 0.975, transition: { duration: 0.01 } }}
      variant="unstyled"
      size="lg"
      fontSize="24px"
      p={5}
      fontWeight={700}
      display="flex"
      alignItems="flex-end"
      justifyContent="flex-start"
      color="white"
      h="100px"
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
