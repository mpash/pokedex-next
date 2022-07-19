import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react'
import { useLocalStorage } from 'react-use'
import { pokemonTypeData } from '../data/pokemon-types'

const pokemonTypes = Object.keys(pokemonTypeData) as PokemonTypes[]

type SelectedPokemonTypesContext = {
  pokemonTypes: PokemonTypes[]
  totalTypes: number
  selectedTypes: PokemonTypes[]
  addSelectedType: (type: PokemonTypes) => void
  removeSelectedType: (type: PokemonTypes) => void
  clearAllSelectedTypes: () => void
  resetSelectedTypes: () => void
  selectAllTypes: () => void
  isSelected: (type: PokemonTypes) => boolean
  exactFilterEnabled: boolean
  setExactFilterEnabled: (isExact: boolean) => void
  weakFilterEnabled: boolean
  setWeakFilterEnabled: (weakFilterEnabled: boolean) => void
  isExpanded: boolean
  setIsExpanded: (isExpanded: boolean) => void
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
  const [selectedTypes, setSelectedTypes] = useLocalStorage<PokemonTypes[]>(
    'selected-types',
    pokemonTypes,
  )
  const [exactFilterEnabled, setExactFilterEnabled] = useState(false)
  const [weakFilterEnabled, setWeakFilterEnabled] = useState(false)
  const [isExpanded, setIsExpanded] = useLocalStorage('expand-types', false)

  const addSelectedType = useCallback(
    (type: PokemonTypes) => {
      if (!selectedTypes) return
      if (selectedTypes.includes(type)) return
      setSelectedTypes([...selectedTypes, type])
    },
    [selectedTypes, setSelectedTypes],
  )

  const removeSelectedType = useCallback(
    (type: PokemonTypes) => {
      if (!selectedTypes) return
      setSelectedTypes(selectedTypes.filter(t => t !== type))
    },
    [selectedTypes, setSelectedTypes],
  )

  const clearAllSelectedTypes = () => setSelectedTypes([])

  const selectAllTypes = useCallback(() => setSelectedTypes(pokemonTypes), [])

  const isSelected = useCallback(
    (type: PokemonTypes) => {
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
      }}
    >
      {children}
    </SelectedPokemonTypesContext.Provider>
  )
}

export const useSelectedPokemonTypes = () =>
  useContext(SelectedPokemonTypesContext)
