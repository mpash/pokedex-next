import { Box, Heading, HeadingProps, theme } from '@chakra-ui/react'

const PokedexV2Logo = (props: HeadingProps) => (
  <Heading
    p={1}
    size="2xl"
    bgClip="text"
    lineHeight="1.4"
    letterSpacing={3}
    fontFamily="pokemon"
    display="inline-block"
    verticalAlign="center"
    bgGradient="linear(to-b, yellow.500 55%, yellow.900 85%)"
    sx={{
      WebkitTextStrokeWidth: '1px',
      WebkitTextStrokeColor: theme.colors.yellow[900],
    }}
    {...props}
  >
    Pokédex
    <Box as="span" fontSize="sm" verticalAlign="top" ml={1}>
      v2
    </Box>
  </Heading>
)

export default PokedexV2Logo
