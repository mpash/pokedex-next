import {
  Button,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react'
import { usePagination } from '@hooks/usePagination'
import {
  faArrowDown19,
  faArrowDownAZ,
  faArrowUp19,
  faArrowUpAZ,
  faFilterSlash,
  faSearch,
} from '@fortawesome/pro-solid-svg-icons'
import { useSelectedPokemonTypes } from '@hooks/useSelectedPokemonTypes'
import { debounce } from 'lodash/fp'
import { memo, RefObject, useMemo, useRef } from 'react'
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
  } = useFilters()

  const handleSearch = debounce(400, (search: string) => {
    setSearch(search)
  })

  const ref = useRef<HTMLInputElement>(null)

  return useMemo(
    () => (
      <HStack spacing={4}>
        <InputGroup size="sm" variant="flushed">
          <InputLeftElement color="gray.400">
            <Icon fixedWidth width="14px" icon={faSearch} />
          </InputLeftElement>
          <Input
            ref={ref}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Name or number"
          />
        </InputGroup>
        <Button
          size="sm"
          variant="outline"
          onClick={toggleNumberOrder}
          isActive={selectedFilter === 'number'}
        >
          <Icon
            w="18px"
            fontSize="18px"
            icon={numberOrder === 1 ? faArrowDown19 : faArrowUp19}
          />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={toggleAlphaOrder}
          isActive={selectedFilter === 'alpha'}
        >
          <Icon
            w="18px"
            fontSize="18px"
            icon={alphaOrder === 'az' ? faArrowDownAZ : faArrowUpAZ}
          />
        </Button>
        <ResetFiltersButton inputRef={ref} />
        {/* <Button size="sm" variant="outline" onClick={handleClearFilters}>
          <Icon w="18px" fontSize="18px" icon={faFilterSlash} />
        </Button> */}
      </HStack>
    ),
    [
      toggleNumberOrder,
      selectedFilter,
      numberOrder,
      toggleAlphaOrder,
      alphaOrder,
      handleSearch,
    ],
  )
}

export default FilterBar

const ResetFiltersButton = memo(
  ({ inputRef }: { inputRef: RefObject<HTMLInputElement> }) => {
    const { resetAllFilters } = useFilters()
    const { resetSelectedTypes, setExactFilterEnabled: setIsExact } =
      useSelectedPokemonTypes()
    const { onPageChange } = usePagination()
    // const handleClearFilters =
    return (
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          resetAllFilters()
          resetSelectedTypes()
          setIsExact(false)
          onPageChange(1)
          if (!inputRef?.current) return
          inputRef.current.value = ''
        }}
      >
        <Icon w="18px" fontSize="18px" icon={faFilterSlash} />
      </Button>
    )
  },
)

ResetFiltersButton.displayName = 'ResetFiltersButton'