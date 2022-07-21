import { Badge, Box, Flex } from '@chakra-ui/react'
import Icon from '@components/icon'
import MotionBox from '@components/motion-box'
import { pokemonTypeData } from '@data/pokemon-types'

export const TypeSummaryItem = ({ type, count, max }) => {
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
