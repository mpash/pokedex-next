import { useFilters } from '@hooks/useFilters'
import { useSelectedPokemonTypes } from '@hooks/useSelectedPokemonTypes'
import { useQuery } from 'react-query'
import { useMemo } from 'react'
import { isEqual, uniqBy } from 'lodash/fp'
import PokemonList from '@components/pokemon/pokemon-list'

export const usePokemonList = () => {
  const { search, alphaOrder, numberOrder, selectedFilter } = useFilters()
  const { selectedTypes, exactFilterEnabled, weakFilterEnabled } =
    useSelectedPokemonTypes()
  const { isLoading, data } = useQuery<PokemonList>('pokedex', () =>
    fetch('/api/pokedex').then(res => res.json()),
  )

  const pokemonById = useMemo(() => uniqBy('id', data), [data])

  const filterBySelectedType = (collection: PokemonList) =>
    collection.filter((item: any) => {
      if (exactFilterEnabled) {
        return isEqual(selectedTypes.sort(), item.type.sort())
      }
      return (
        selectedTypes.length > 0 &&
        selectedTypes.some(type => item.type.includes(type))
      )
    })
  const filterBySearch = (collection: PokemonList) =>
    collection.filter(
      (item: any) =>
        search === '' ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.number.toString().includes(search),
    )

  const filterByWeakness = (collection: PokemonList) => {
    const newLocal = collection.filter((pokemon: Pokemon) => {
      const weaknesses = pokemon.weakness.map(w =>
        w.toLowerCase(),
      ) as PokemonTypes[]
      // console.log(
      //   weaknesses,
      //   selectedTypes,
      //   weaknesses.some(weakness => selectedTypes.includes(weakness)),
      // )
      return weaknesses.some(weakness => selectedTypes.includes(weakness))
    })
    // console.log(newLocal)

    return newLocal
  }

  const orderByAlpha = (collection: PokemonList) =>
    !!collection &&
    collection.sort((a, b) => {
      if (alphaOrder === 'az') {
        return a.name.localeCompare(b.name)
      } else {
        return b.name.localeCompare(a.name)
      }
    })
  const orderByNumber = (collection: PokemonList) =>
    !!collection &&
    collection.sort((a, b) => {
      if (numberOrder === 1) {
        return parseInt(a.number) - parseInt(b.number)
      } else {
        return parseInt(b.number) - parseInt(a.number)
      }
    })

  let pokemon: PokemonList = []

  const pokemonBySearch = filterBySearch(pokemonById)

  const filteredCollection = weakFilterEnabled
    ? filterByWeakness(pokemonBySearch)
    : filterBySelectedType(pokemonBySearch)

  switch (selectedFilter) {
    case 'alpha':
      pokemon = orderByAlpha(filteredCollection)
      break
    case 'number':
      pokemon = orderByNumber(filteredCollection)
      break
    default:
      pokemon = filteredCollection
  }

  return {
    isLoading,
    pokemon,
  }
}
