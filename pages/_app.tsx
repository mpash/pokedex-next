import { ChakraProvider } from '@chakra-ui/react'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { trpc } from '@src/utils/trpc'
import { Hydrate, QueryClient, QueryClientConfig, QueryClientProvider } from '@tanstack/react-query'
import { AppProps } from 'next/app'
import { useRef } from 'react'
import theme from 'theme'

config.autoAddCss = false

export const queryClientOptions: QueryClientConfig = {
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
      // cacheTime: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
  },
}

function App({ Component, pageProps }: AppProps) {
  const queryClientRef = useRef<QueryClient>(new QueryClient(queryClientOptions))

  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClientRef.current}>
        <Hydrate state={pageProps.dehydratedState}>
          <Component {...pageProps} />
        </Hydrate>
      </QueryClientProvider>
    </ChakraProvider>
  )
}

// export default trpc.withTRPC(App)
export default App
