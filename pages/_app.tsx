// pages/_app.js
import { ChakraProvider } from '@chakra-ui/react'
import { FilterProvider } from '@hooks/useFilters'
import { PaginationProvider } from '@hooks/usePagination'
import { SelectedPokemonTypesProvider } from '@hooks/useSelectedPokemonTypes'
import { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <SelectedPokemonTypesProvider>
          <PaginationProvider>
            <FilterProvider>
              <Component {...pageProps} />
            </FilterProvider>
          </PaginationProvider>
        </SelectedPokemonTypesProvider>
      </QueryClientProvider>
    </ChakraProvider>
  )
}

export default MyApp
