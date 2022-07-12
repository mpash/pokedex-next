import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react'
import { pokemonTypeData } from '../data/pokemon-types'

export type PokemonType = keyof typeof pokemonTypeData
const pokemonTypes = Object.keys(pokemonTypeData) as PokemonType[]

const SelectedTypesContext = createContext<{
  pokemonTypes: PokemonType[]
  totalTypes: number
  selectedTypes: PokemonType[]
  addSelectedType: (type: PokemonType) => void
  removeSelectedType: (type: PokemonType) => void
  clearAllSelectedTypes: () => void
  resetSelectedTypes: () => void
  selectAllTypes: () => void
  isSelected: (type: PokemonType) => boolean
  isExact: boolean
  setIsExact: (isExact: boolean) => void
}>(null as any)

export const SelectedPokemonTypesProvider = ({
  children,
}: {
  children?: ReactNode
}) => {
  const totalTypes = pokemonTypes.length
  const [selectedTypes, setSelectedTypes] =
    useState<PokemonType[]>(pokemonTypes)
  const [isExact, setIsExact] = useState(false)

  const addSelectedType = useCallback(
    (type: PokemonType) => {
      if (selectedTypes.includes(type)) return
      setSelectedTypes([...selectedTypes, type])
    },
    [selectedTypes],
  )
  const removeSelectedType = useCallback(
    (type: PokemonType) => {
      setSelectedTypes(selectedTypes.filter(t => t !== type))
    },
    [selectedTypes],
  )
  const clearAllSelectedTypes = useCallback(() => {
    setSelectedTypes([])
  }, [])
  const selectAllTypes = useCallback(() => setSelectedTypes(pokemonTypes), [])
  const isSelected = useCallback(
    (type: PokemonType) => selectedTypes.includes(type),
    [selectedTypes],
  )
  const resetSelectedTypes = useCallback(
    () => setSelectedTypes(pokemonTypes),
    [],
  )

  return (
    <SelectedTypesContext.Provider
      value={{
        isExact,
        pokemonTypes,
        totalTypes,
        selectedTypes,
        addSelectedType,
        removeSelectedType,
        clearAllSelectedTypes,
        resetSelectedTypes,
        selectAllTypes,
        isSelected,
        setIsExact,
      }}
    >
      {children}
    </SelectedTypesContext.Provider>
  )
}

export const useSelectedPokemonTypes = () => useContext(SelectedTypesContext)
