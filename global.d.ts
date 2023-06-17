type PokemonType =
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
  icon?: IconProps
  component?: any
}

type PokemonTypeData = {
  [key in PokemonType]: PokemonTypeDatum
}

declare namespace DataSources {
  type PokemonUs = {
    abilities: string[] // ["Overgrow"]
    detailPageURL: string // /us/pokedex/bulbasaur
    weight: number // 15.2
    weakness: PokemonType[] // ['Fire', 'Flying', 'Ice', 'Psychic']
    number: string // 0001
    height: number // 28
    collectibles_slug: string // 'bulbasaur'
    featured: string // 'true'
    slug: string // 'bulbasaur'
    name: string // 'Bulbasaur'
    ThumbnailAltText: string // 'Bulbasaur'
    ThumbnailImage: string //'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/001.png'
    id: number // 1
    type: PokemonType[] // ['grass', 'poison']
  }

  type PokemonUsScrape = {
    name: string // "Bulbasaur"
    number: string // "0001"
    subVariant: number // 0
    slug: string // "bulbasaur"
    descriptionX: string // "There is a plant seed on its back right from the day this Pokémon is born. The seed slowly grows larger."
    descriptionY: string // "While it is young, it uses the nutrients that are stored in the seed on its back in order to grow."
    image: string // "https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png"
  }

  type PokemonJp = {
    kyodai_flg: number // 0
    image_s: string // 'https://zukan.pokemon.co.jp/zukan-api/up/images/index/afa02eaba4c39820fc57f4e8abaeea80.png'
    sub_name: string // ''
    sub: number // 0
    type_2: number // 8
    image_m: string // 'https://zukan.pokemon.co.jp/zukan-api/up/images/index/7b705082db2e24dd4ba25166dac84e0a.png'
    no: string // '0001'
    type_1: number // 4
    takasa: string // '0.7'
    zukan_no: string // '0001'
    name: string // 'フシギダネ'
    omosa: string // '6.9'
  }

  type PokemonUsJpScrape = PokemonUs & {
    subVariant: number
    scrapedData: PokemonUsScrape
    japaneseData: PokemonJp
  }
}

declare namespace Archive {
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
    fId: string
    originalName: string
    japaneseVariants: Pokemon[]
  }

  type PokemonList = Pokemon[]
}
