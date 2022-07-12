import { Box, Flex, HStack } from '@chakra-ui/react'
import { faCircle } from '@fortawesome/pro-solid-svg-icons'
import { usePagination } from '@hooks/usePagination'
import { ReactNode } from 'react'
import { useKeyPressEvent, useMeasure } from 'react-use'
import Icon from './icon'

const PaginationBar = () => {
  const { currentPage, totalPages, onPreviousPage, onNextPage, onPageChange } =
    usePagination()
  const [ref, { width }] = useMeasure<HTMLDivElement>()

  useKeyPressEvent('ArrowLeft', onPreviousPage)
  useKeyPressEvent('ArrowRight', onNextPage)
  useKeyPressEvent('1', () => onPageChange(1))
  useKeyPressEvent('0', () => onPageChange(totalPages))

  const buttons: ReactNode[] = []
  for (let i = 1; i <= totalPages; i++) {
    const isActive = currentPage === i
    const handleClick = () => onPageChange(i)
    buttons.push(
      <Box
        key={i}
        color={isActive ? 'blue.500' : 'gray.200'}
        cursor="pointer"
        onClick={handleClick}
      >
        <Icon w={[2, 3]} icon={faCircle}></Icon>
      </Box>,
    )
  }

  if (totalPages === 1) {
    return null
  }

  return (
    <Box
      ref={ref}
      zIndex={2}
      pos="fixed"
      left={`calc(50% - ${width}px / 2)`}
      bottom="calc(env(safe-area-inset-bottom) + 0px)"
    >
      <Flex
        boxShadow="md"
        bgColor="white"
        px={2}
        py={1}
        justifyContent="center"
        borderRadius={14}
      >
        <HStack spacing={[2, 4]}>{buttons}</HStack>
      </Flex>
    </Box>
  )
}

export default PaginationBar
