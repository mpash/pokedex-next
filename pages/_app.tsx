import { ChakraProvider, useColorMode } from '@chakra-ui/react'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { trpc } from '@src/utils/trpc'
import { Hydrate, QueryClient, QueryClientConfig, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { AppProps } from 'next/app'
import { useEffect, useRef } from 'react'
import theme from 'theme'
import { Analytics } from '@vercel/analytics/react'

config.autoAddCss = false

export const queryClientOptions: QueryClientConfig = {
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
      cacheTime: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
  },
}

function App({ Component, pageProps: { session, dehydratedState, ...pageProps } }: AppProps) {
  const queryClientRef = useRef<QueryClient>(new QueryClient(queryClientOptions))

  return (
    <SessionProvider session={session}>
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClientRef.current}>
          <Hydrate state={dehydratedState}>
            <AppClient>
              <Component {...pageProps} />
              <Analytics />
            </AppClient>
          </Hydrate>
        </QueryClientProvider>
      </ChakraProvider>
    </SessionProvider>
  )
}

export default trpc.withTRPC(App)

const AppClient = ({ children }: { children?: React.ReactNode }) => {
  const { setColorMode } = useColorMode()

  useEffect(() => {
    setColorMode('dark')
  }, [setColorMode])

  return <>{children}</>
}
