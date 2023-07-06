import { PokemonListItem } from '@/pages/api/pokemon'
import { QueryFunction, useInfiniteQuery } from '@tanstack/react-query'

const fetchPokemon: QueryFunction<
  {
    data: PokemonListItem[]
    pagination: { nextPage: string | null; pageSize: number }
  },
  (string | boolean | undefined)[]
> = async ({ signal, pageParam, queryKey }) => {
  const url = new URL('/api/pokemon', window.location.origin)
  url.searchParams.set('pageSize', '200')

  const [_, query, showVariants] = queryKey

  if (!!query && query !== '') url.searchParams.append('q', typeof query === 'string' ? query : query.toString())
  if (!showVariants) url.searchParams.append('hideVariants', 'true')

  const res = await fetch(pageParam ?? url, {
    signal,
  })
  const data = await res.json()

  if (!res.ok) throw new Error((await res.json()) ?? 'Something went wrong')

  return data
}

export default function usePokemonList(params?: { query?: string; showVariants?: boolean }) {
  return useInfiniteQuery({
    queryKey: ['Pokemon', params?.query, params?.showVariants],
    getNextPageParam: lastPage => lastPage.pagination.nextPage,
    queryFn: fetchPokemon,
    keepPreviousData: true,
  })
}
