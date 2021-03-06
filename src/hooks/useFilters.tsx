import { createContext, useCallback, useContext, useState } from 'react'

type FilterContext = {
  search: string
  numberOrder: 1 | -1
  alphaOrder: 'az' | 'za'
  selectedFilter: 'alpha' | 'number' | null
  setSearch: (search: string) => void
  toggleNumberOrder: () => void
  toggleAlphaOrder: () => void
  resetAllFilters: () => void
  showVariants: boolean
  setShowVariants: (shouldShow: boolean) => void
  toggleShowVariants: () => void
  startNumber: number
  setStartNumber: (startNumber: number) => void
  endNumber: number
  setEndNumber: (endNumber: number) => void
}
const FilterContext = createContext<FilterContext>(null as any)

export const FilterProvider = ({ children }) => {
  const [search, setSearch] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<
    'alpha' | 'number' | null
  >('number')
  const [alphaOrder, setAlphaOrder] = useState<'az' | 'za'>('az')
  const [numberOrder, setNumberOrder] = useState<1 | -1>(1)
  const [showVariants, setShowVariants] = useState(false)
  const [startNumber, setStartNumber] = useState(1)
  const [endNumber, setEndNumber] = useState(905)

  const reverseAlphaOrder = useCallback(() => {
    setAlphaOrder(alphaOrder === 'az' ? 'za' : 'az')
  }, [alphaOrder])

  const reverseNumberOrder = useCallback(() => {
    setNumberOrder(numberOrder === 1 ? -1 : 1)
  }, [numberOrder])

  const toggleNumberOrder = useCallback(() => {
    if (selectedFilter === 'alpha') {
      setNumberOrder(1)
    } else {
      reverseNumberOrder()
    }
    setSelectedFilter('number')
  }, [reverseNumberOrder, selectedFilter])

  const toggleAlphaOrder = useCallback(() => {
    if (selectedFilter === 'number') {
      setAlphaOrder('az')
    } else {
      reverseAlphaOrder()
    }
    setSelectedFilter('alpha')
  }, [reverseAlphaOrder, selectedFilter])

  const toggleShowVariants = useCallback(() => {
    setShowVariants(!showVariants)
  }, [showVariants])

  const resetAllFilters = useCallback(() => {
    setSearch('')
    setSelectedFilter('number')
    setAlphaOrder('az')
    setNumberOrder(1)
    setStartNumber(1)
    setEndNumber(905)
  }, [])

  return (
    <FilterContext.Provider
      value={{
        search,
        setSearch,
        toggleAlphaOrder,
        toggleNumberOrder,
        selectedFilter,
        numberOrder,
        alphaOrder,
        resetAllFilters,
        showVariants,
        setShowVariants,
        toggleShowVariants,
        startNumber,
        setStartNumber,
        endNumber,
        setEndNumber,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export const useFilters = () => useContext(FilterContext)
