import { useFilters } from '@hooks/useFilters'
import { useSelectedPokemonTypes } from '@hooks/useSelectedPokemonTypes'
import { isEqual, uniqBy } from 'lodash/fp'
import { useMemo } from 'react'
import { useQuery } from 'react-query'

export const usePokemonList = () => {
  const { search, alphaOrder, numberOrder, selectedFilter, showVariants } =
    useFilters()
  const { selectedTypes, exactFilterEnabled, weakFilterEnabled } =
    useSelectedPokemonTypes()
  const { isLoading, data } = useQuery<PokemonList>('pokedex', () =>
    fetch('/api/pokedex').then(res => res.json()),
  )

  const pokemonById = useMemo(() => {
    if (showVariants) {
      return uniqBy('id', data)
        .map(p =>
          p.variants.map((v, index) => {
            const base = {
              ...v,
              originalName: p.name,
              weakness: p.weakness,
              type: p.type,
              number: p.number,
              id: p.id,
              fId: `f${index + 1}`,
            }
            if (index > 0) {
              const fId = `f${index + 1}`
              const path = `/img/full-trimmed/${p.number}_${fId}.png`
              return { ...base, ThumbnailImage: path }
            } else {
              const path = `/img/full-trimmed/${p.number}.png`
              return { ...base, ThumbnailImage: path }
            }
          }),
        )
        .flat()
    }
    return uniqBy('id', data).map(p => ({
      ...p,
      ThumbnailImage: `/img/full-trimmed/${p.number}.png`,
    }))
  }, [data, showVariants])

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
        item?.originalName?.toLowerCase()?.includes(search.toLowerCase()) ||
        item.number.toString().includes(search),
    )

  const filterByWeakness = (collection: PokemonList) => {
    return collection.filter((pokemon: Pokemon) => {
      const weaknesses = pokemon.weakness.map(w =>
        w.toLowerCase(),
      ) as PokemonTypes[]
      if (exactFilterEnabled) {
        return selectedTypes.every(type => weaknesses.includes(type))
      }
      return weaknesses.some(weakness => selectedTypes.includes(weakness))
    })
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

  if (!pokemonById) {
    return {
      isLoading,
      pokemon,
    }
  }

  const pokemonBySearch = filterBySearch(pokemonById as any)

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
