import { useFilters } from '@hooks/useFilters'
import { useSelectedPokemonTypes } from '@hooks/useSelectedPokemonTypes'
import { isEqual, uniqBy } from 'lodash/fp'
import { useMemo } from 'react'
import { useQuery } from 'react-query'

export const usePokemonList = () => {
  const {
    search,
    alphaOrder,
    numberOrder,
    selectedFilter,
    showVariants,
    startNumber,
    endNumber,
  } = useFilters()
  const { selectedTypes, exactFilterEnabled, weakFilterEnabled } =
    useSelectedPokemonTypes()
  const { isLoading, data } = useQuery<Archive.PokemonList>('pokedex', () =>
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
            const fId = `f${index + 1}`
            const path =
              index > 0
                ? `/img/full-trimmed/${p.number}_${fId}.png`
                : `/img/full-trimmed/${p.number}.png`
            return { ...base, ThumbnailImage: path }
          }),
        )
        .flat()
    }
    return uniqBy('id', data).map(p => ({
      ...p,
      ThumbnailImage: `/img/full-trimmed/${p.number}.png`,
    }))
  }, [data, showVariants])

  const filterBySelectedType = (collection: Archive.PokemonList) =>
    collection.filter((item: any) => {
      if (exactFilterEnabled) {
        return isEqual(selectedTypes.sort(), item.type.sort())
      }
      return (
        selectedTypes.length > 0 &&
        selectedTypes.some(type => item.type.includes(type))
      )
    })
  const filterBySearch = (collection: Archive.PokemonList) =>
    collection.filter(
      (item: any) =>
        search === '' ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item?.originalName?.toLowerCase()?.includes(search.toLowerCase()) ||
        item.number.toString().includes(search),
    )

  const filterByWeakness = (collection: Archive.PokemonList) => {
    return collection.filter((pokemon: Archive.Pokemon) => {
      const weaknesses = pokemon.weakness.map(w =>
        w.toLowerCase(),
      ) as PokemonType[]
      if (exactFilterEnabled) {
        return selectedTypes.every(type => weaknesses.includes(type))
      }
      return weaknesses.some(weakness => selectedTypes.includes(weakness))
    })
  }

  const filterByRange = (collection: Archive.PokemonList) => {
    return collection.filter((pokemon: Archive.Pokemon) => {
      return pokemon.id >= startNumber && pokemon.id <= endNumber
    })
  }

  const orderByAlpha = (collection: Archive.PokemonList) =>
    !!collection &&
    collection.sort((a, b) => {
      if (alphaOrder === 'az') {
        return a.name.localeCompare(b.name)
      } else {
        return b.name.localeCompare(a.name)
      }
    })
  const orderByNumber = (collection: Archive.PokemonList) =>
    !!collection &&
    collection.sort((a, b) => {
      if (numberOrder === 1) {
        return parseInt(a.number) - parseInt(b.number)
      } else {
        return parseInt(b.number) - parseInt(a.number)
      }
    })

  let pokemon: Archive.PokemonList = []

  if (!pokemonById) {
    return {
      isLoading,
      pokemon,
    }
  }

  const pokemonByRange = filterByRange(pokemonById as any)
  const pokemonBySearch = filterBySearch(pokemonByRange)

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
