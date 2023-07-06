import { extendTheme } from '@chakra-ui/react'
import { Inter, Josefin_Sans } from 'next/font/google'
import localFont from 'next/font/local'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const josefinSans = Josefin_Sans({
  subsets: ['latin'],
  variable: '--font-josefin-sans',
})

const pokemonFont = localFont({
  src: './fonts/pokemon.ttf',
  variable: '--font-pokemon',
})

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: true,
  },
  fonts: {
    heading: josefinSans.style.fontFamily,
    body: inter.style.fontFamily,
    pokemon: pokemonFont.style.fontFamily,
  },
})

export default theme
