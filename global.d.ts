type Pokemon = {
  id: number
  abilities: string[]
  detailPageURL: string
  weight: number
  weakness: string[]
  number: string
  height: number
  collectibles_slug: string
  featured: 'true' | 'false'
  slug: string
  name: string
  ThumbnailAltText: string
  ThumbnailImage: string
  type: string[]
  variants: {
    name: string
    number: string
    descriptionX: string
    descriptionY: string
    image: string
  }[]
}

type PokemonList = Pokemon[]

type PokemonTypes =
  | 'grass'
  | 'fire'
  | 'water'
  | 'electric'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel'
  | 'fairy'
  | 'normal'

type PokemonTypeDatum = {
  primary: string
  secondary: string
  color: string
  icon: any
}
type PokemonTypeData = {
  [K in PokemonTypes]: PokemonTypeDatum
}
