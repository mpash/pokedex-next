import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react'
import { useLocalStorage } from 'react-use'
import { pokemonTypeData } from '../data/pokemon-types'

export type PokemonType = keyof typeof pokemonTypeData
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
  const [selectedTypes, setSelectedTypes] = useLocalStorage<PokemonType[]>(
    'selected-types',
    pokemonTypes,
  )
  const [exactFilterEnabled, setExactFilterEnabled] = useState(false)
  const [weakFilterEnabled, setWeakFilterEnabled] = useState(false)

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

  const clearAllSelectedTypes = useCallback(() => {
    setSelectedTypes([])
  }, [setSelectedTypes])

  const selectAllTypes = useCallback(() => setSelectedTypes(pokemonTypes), [])

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
      }}
    >
      {children}
    </SelectedPokemonTypesContext.Provider>
  )
}

export const useSelectedPokemonTypes = () => useContext(SelectedPokemonTypesContext)
