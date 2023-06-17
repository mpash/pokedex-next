import {
  faBoltLightning,
  faBoxingGlove,
  faBug,
  faCrystalBall,
  faDragon,
  faDroplet,
  faFire,
  faFlaskPoison,
  faGhost,
  faHillRockslide,
  faLeaf,
  faManhole,
  faMoon,
  faScrubber,
  faSnowflake,
  faSparkles,
  faWind,
} from '@fortawesome/pro-solid-svg-icons'
import { faHexagon } from '@fortawesome/sharp-solid-svg-icons'
import Icon from '@src/components/icon'

export const pokemonTypeData: PokemonTypeData = {
  grass: {
    primary: 'green.400',
    secondary: 'green.50',
    color: 'white',
    icon: faLeaf,
  },
  bug: {
    primary: 'green.600',
    secondary: 'green.50',
    color: 'white',
    icon: faBug,
  },
  water: {
    primary: 'blue.400',
    secondary: 'blue.50',
    color: 'white',
    icon: faDroplet,
  },
  fairy: {
    primary: 'pink.500',
    secondary: 'pink.50',
    color: 'white',
    icon: faSparkles,
  },
  ice: {
    primary: 'teal.300',
    secondary: 'teal.50',
    color: 'white',
    icon: faSnowflake,
  },
  ghost: {
    primary: 'blue.500',
    secondary: 'blue.50',
    color: 'white',
    icon: faGhost,
  },
  flying: {
    primary: 'cyan.500',
    secondary: 'cyan.50',
    color: 'white',
    icon: faWind,
  },
  normal: {
    primary: 'gray.500',
    secondary: 'gray.50',
    color: 'white',
    icon: faScrubber,
  },
  steel: {
    primary: 'blue.800',
    secondary: 'gray.50',
    color: 'white',
    component: (
      <Icon transform="shrink-3" size="lg" icon={faHexagon} mask={faHexagon} />
    ),
  },
  dark: {
    primary: 'gray.900',
    secondary: 'gray.50',
    color: 'white',
    icon: faMoon,
  },
  poison: {
    primary: 'purple.700',
    secondary: 'purple.50',
    color: 'white',
    icon: faFlaskPoison,
  },
  psychic: {
    primary: 'purple.900',
    secondary: 'purple.50',
    color: 'white',
    icon: faCrystalBall,
  },
  fire: {
    primary: 'red.500',
    secondary: 'red.50',
    color: 'white',
    icon: faFire,
  },
  electric: {
    primary: 'yellow.400',
    secondary: 'yellow.50',
    color: 'white',
    icon: faBoltLightning,
  },
  fighting: {
    primary: 'orange.300',
    secondary: 'orange.50',
    color: 'white',
    icon: faBoxingGlove,
  },
  ground: {
    primary: 'orange.500',
    secondary: 'orange.50',
    color: 'white',
    icon: faManhole,
  },
  rock: {
    primary: 'orange.700',
    secondary: 'orange.50',
    color: 'white',
    icon: faHillRockslide,
  },
  dragon: {
    primary: 'cyan.800',
    secondary: 'blue.50',
    color: 'white',
    icon: faDragon,
  },
}