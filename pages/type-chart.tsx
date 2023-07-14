import { Box, HStack } from '@chakra-ui/react'
import { PokemonType } from '@src/components/pokemon'
import { typeMatrix2 } from '@src/data/typeCalculator'

const TypeChartPage = () => {
  return (
    <Box ml="calc(50% - 1146px/2)" mt={20}>
      <Box display="grid">
        <HStack>
          <Box w="82px" h="82px" mr={0}></Box>
          {Object.keys(typeMatrix2).map((type, index) => (
            <Box
              key={type}
              w="82px"
              fontWeight={600}
              fontSize="sm"
              transform={`rotate(-45deg) translateX(-${index * 22.8}px) translateY(-${index * 22.8}px)`}
            >
              <PokemonType type={type as PokemonType} />
            </Box>
          ))}
        </HStack>
        {Object.keys(typeMatrix2).map(type => {
          return (
            <>
              <HStack pos="relative" spacing={0}>
                <Box w="82px" h="100%" fontWeight={600} fontSize="sm">
                  <PokemonType type={type as PokemonType} />
                </Box>
                {Object.keys(typeMatrix2).map(type2 => {
                  const typeWeakness = typeMatrix2[type][type2]
                  const bgColor = (() => {
                    switch (typeWeakness) {
                      case 0.5:
                        return 'red.600'
                      case 1:
                        return 'transparent'
                      case 2:
                        return 'green.600'
                      default:
                        return 'gray.600'
                    }
                  })()
                  const color = (() => {
                    switch (typeWeakness) {
                      case 0.5:
                        return 'white'
                      case 1:
                        return 'inherit'
                      case 2:
                        return 'white'
                      default:
                        return 'white'
                    }
                  })()
                  return (
                    <Box
                      key={type2}
                      w="58px"
                      h="100%"
                      py={1.5}
                      display="flex"
                      justifyContent="center"
                      borderRightWidth={1}
                      borderBottomWidth={1}
                      borderColor="whiteAlpha.100"
                    >
                      <Box
                        borderRadius="md"
                        bgColor={bgColor}
                        color={color}
                        fontSize="sm"
                        w="40px"
                        textAlign="center"
                        fontWeight={600}
                      >
                        {typeWeakness}
                        <Box as="span" fontSize="xs">
                          x
                        </Box>
                      </Box>
                    </Box>
                  )
                })}
              </HStack>
            </>
          )
        })}
      </Box>
    </Box>
  )
}

export default TypeChartPage
