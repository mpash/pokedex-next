import { useLocalStorageValue } from '@react-hookz/web'
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react'
import { pokemonTypeData } from '../data/pokemon-types'

const pokemonTypes = Object.keys(pokemonTypeData) as PokemonType[]

type SelectedPokemonTypesContext = {
  pokemonTypes: PokemonType[]
  totalTypes: number
  selectedTypes: PokemonType[]
  addSelectedType: (type: PokemonType) => void
  removeSelectedType: (type: PokemonType) => void
  clearAllSelectedTypes: () => void
  resetSelectedTypes: () => void
  selectAllTypes: () => void
  isSelected: (type: PokemonType) => boolean
  exactFilterEnabled: boolean
  setExactFilterEnabled: (isExact: boolean) => void
  weakFilterEnabled: boolean
  setWeakFilterEnabled: (weakFilterEnabled: boolean) => void
  isExpanded: boolean
  setIsExpanded: (isExpanded: boolean) => void
  typeSummaryIsVisible: boolean
  setTypeSummaryIsVisible: (typeSummaryIsVisible: boolean) => void
}
const SelectedPokemonTypesContext = createContext<SelectedPokemonTypesContext>(
  null as any,
)

export const SelectedPokemonTypesProvider = ({
  children,
}: {
  children?: ReactNode
}) => {
  const totalTypes = pokemonTypes.length
  const { value: selectedTypes, set: setSelectedTypes } = useLocalStorageValue<
    PokemonType[]
  >('selected-types', {
    defaultValue: pokemonTypes,
  })
  const [exactFilterEnabled, setExactFilterEnabled] = useState(false)
  const [weakFilterEnabled, setWeakFilterEnabled] = useState(false)
  const { value: isExpanded, set: setIsExpanded } = useLocalStorageValue(
    'expand-types',
    {
      defaultValue: false,
    },
  )
  const [typeSummaryIsVisible, setTypeSummaryIsVisible] = useState(false)

  const addSelectedType = useCallback(
    (type: PokemonType) => {
      if (!selectedTypes) return
      if (selectedTypes.includes(type)) return
      setSelectedTypes([...selectedTypes, type])
    },
    [selectedTypes, setSelectedTypes],
  )

  const removeSelectedType = useCallback(
    (type: PokemonType) => {
      if (!selectedTypes) return
      setSelectedTypes(selectedTypes.filter(t => t !== type))
    },
    [selectedTypes, setSelectedTypes],
  )

  const clearAllSelectedTypes = () => setSelectedTypes([])

  const selectAllTypes = useCallback(
    () => setSelectedTypes(pokemonTypes),
    [setSelectedTypes],
  )

  const isSelected = useCallback(
    (type: PokemonType) => {
      if (!selectedTypes) return false
      return selectedTypes.includes(type)
    },
    [selectedTypes],
  )

  const resetSelectedTypes = useCallback(
    () => setSelectedTypes(pokemonTypes),
    [setSelectedTypes],
  )

  return (
    <SelectedPokemonTypesContext.Provider
      value={{
        exactFilterEnabled,
        setExactFilterEnabled,
        weakFilterEnabled,
        setWeakFilterEnabled,
        pokemonTypes,
        totalTypes,
        selectedTypes: selectedTypes ?? [],
        addSelectedType,
        removeSelectedType,
        clearAllSelectedTypes,
        resetSelectedTypes,
        selectAllTypes,
        isSelected,
        isExpanded: isExpanded ?? false,
        setIsExpanded,
        typeSummaryIsVisible,
        setTypeSummaryIsVisible,
      }}
    >
      {children}
    </SelectedPokemonTypesContext.Provider>
  )
}

export const useSelectedPokemonTypes = () =>
  useContext(SelectedPokemonTypesContext)
