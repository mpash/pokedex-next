import { ChakraProvider } from '@chakra-ui/react'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { FilterProvider } from '@hooks/useFilters'
import { PaginationProvider } from '@hooks/usePagination'
import { SelectedPokemonTypesProvider } from '@hooks/useSelectedPokemonTypes'
import { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from 'react-query'
import theme from 'theme'

config.autoAddCss = false

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
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
