import { extendTheme } from '@chakra-ui/react'
import { Inter, Montserrat, Josefin_Sans } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
})

const josefinSans = Josefin_Sans({
  subsets: ['latin'],
  variable: '--font-josefin-sans',
})

const theme = extendTheme({
  fonts: {
    heading: josefinSans.style.fontFamily,
    // heading: montserrat.style.fontFamily,
    body: inter.style.fontFamily,
  },
})

export default theme
