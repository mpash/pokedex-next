import { ChakraProvider } from '@chakra-ui/react'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { FilterProvider } from '@hooks/useFilters'
import { PaginationProvider } from '@hooks/usePagination'
import { SelectedPokemonTypesProvider } from '@hooks/useSelectedPokemonTypes'
import { trpc } from '@src/utils/trpc'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppProps } from 'next/app'
import theme from 'theme'

config.autoAddCss = false

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
    },
  },
})

function App({ Component, pageProps }: AppProps) {
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

export default trpc.withTRPC(App)
