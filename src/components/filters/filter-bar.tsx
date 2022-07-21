import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
} from '@chakra-ui/react'
import {
  faArrowDown19,
  faArrowDownAZ,
  faArrowUp19,
  faArrowUpAZ,
  faDna,
  faFilterSlash,
  faKeyboard,
  faSearch,
} from '@fortawesome/pro-solid-svg-icons'
import { usePagination } from '@hooks/usePagination'
import { useSelectedPokemonTypes } from '@hooks/useSelectedPokemonTypes'
import { debounce } from 'lodash/fp'
import { memo, RefObject, useRef } from 'react'
import { useFilters } from '../../hooks/useFilters'
import Icon from '../icon'

const FilterBar = () => {
  const {
    setSearch,
    toggleAlphaOrder,
    toggleNumberOrder,
    selectedFilter,
    numberOrder,
    alphaOrder,
    showVariants,
    toggleShowVariants,
    setStartNumber,
    setEndNumber,
    startNumber,
    endNumber,
  } = useFilters()

  const handleSearch = debounce(400, (search: string) => {
    setSearch(search)
  })

  const ref = useRef<HTMLInputElement>(null)

  return (
    <Box
      display="grid"
      gridGap={2}
      gridAutoFlow="column"
      gridTemplateColumns="1fr repeat(3, auto)"
      alignItems="center"
    >
      <InputGroup size="sm" variant="flushed">
        <InputLeftElement color="gray.400">
          <Icon w="14px" h="14px" icon={faSearch} />
        </InputLeftElement>
        <Input
          ref={ref}
          onKeyDown={e => {
            // Prevents the input from causing keyboard events
            // to bubble up (e.g. pagination keyboard listeners)
            e.stopPropagation()
          }}
          onChange={e => {
            return handleSearch(e.target.value)
          }}
          placeholder="Name or number"
        />
      </InputGroup>
      <Button
        size={['xs']}
        variant="outline"
        // isActive={showVariants}
        // title={showVariants ? 'Hide Variants' : 'Show Variants'}
      >
        <Icon mr={[0, 1]} w="14px" h="14px" icon={faKeyboard} />
        <Box as="span" display={['none', 'unset']}>
          Kbd Cmds
        </Box>
      </Button>
      <HStack w={['135px', '175px']} alignItems="center">
        <NumberInput
          title="Start Number"
          defaultValue={1}
          min={1}
          max={905}
          size={['xs']}
          value={startNumber}
          keepWithinRange
          allowMouseWheel
          onChange={value => {
            setStartNumber(Number(value))
          }}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <Box display={['none', 'unset']}>to</Box>
        <NumberInput
          title="End Number"
          defaultValue={905}
          min={1}
          max={905}
          size={['xs']}
          value={endNumber}
          allowMouseWheel
          onChange={value => {
            setEndNumber(Number(value))
          }}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </HStack>
      <Button
        size={['xs']}
        variant="outline"
        onClick={toggleShowVariants}
        isActive={showVariants}
        title={showVariants ? 'Hide Forms' : 'Show Forms'}
      >
        <Icon mr={[0, 1]} w="14px" h="14px" icon={faDna} />
        <Box as="span" display={['none', 'unset']}>
          Show Forms
        </Box>
      </Button>
      <Button
        size={['xs']}
        variant="outline"
        onClick={toggleNumberOrder}
        isActive={selectedFilter === 'number'}
      >
        <Icon
          mr={[0, 1]}
          w="14px"
          icon={numberOrder === 1 ? faArrowDown19 : faArrowUp19}
        />
        <Box as="span" display={['none', 'unset']}>
          Sort #
        </Box>
      </Button>
      <Button
        size={['xs']}
        variant="outline"
        onClick={toggleAlphaOrder}
        isActive={selectedFilter === 'alpha'}
      >
        <Icon
          mr={[0, 1]}
          w="14px"
          icon={alphaOrder === 'az' ? faArrowDownAZ : faArrowUpAZ}
        />
        <Box as="span" display={['none', 'unset']}>
          Sort {alphaOrder === 'za' ? 'A-Z' : 'Z-A'}
        </Box>
      </Button>
      <ResetFiltersButton inputRef={ref} />
    </Box>
  )
}

export default FilterBar

const ResetFiltersButton = memo(
  ({ inputRef }: { inputRef: RefObject<HTMLInputElement> }) => {
    const { resetAllFilters } = useFilters()
    const { resetSelectedTypes, setExactFilterEnabled, setWeakFilterEnabled } =
      useSelectedPokemonTypes()
    const { onPageChange } = usePagination()
    return (
      <Button
        size={['xs']}
        variant="outline"
        onClick={() => {
          resetAllFilters()
          resetSelectedTypes()
          setExactFilterEnabled(false)
          setWeakFilterEnabled(false)
          onPageChange(1)
          if (!inputRef?.current) return
          inputRef.current.value = ''
        }}
      >
        <Icon mr={[0, 1]} w="14px" icon={faFilterSlash} />
        <Box as="span" display={['none', 'unset']}>
          Reset Filters
        </Box>
      </Button>
    )
  },
)

ResetFiltersButton.displayName = 'ResetFiltersButton'
