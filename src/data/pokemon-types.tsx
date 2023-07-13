import {
  BugIcon,
  DarkIcon,
  DragonIcon,
  ElectricIcon,
  FairyIcon,
  FightingIcon,
  FireIcon,
  FlyingIcon,
  GhostIcon,
  GrassIcon,
  GroundIcon,
  IceIcon,
  NormalIcon,
  PoisonIcon,
  PsychicIcon,
  RockIcon,
  SteelIcon,
  WaterIcon,
} from '@src/utils/icons'

export const pokemonTypeData: PokemonTypeData = {
  grass: {
    primary: 'green.400',
    secondary: 'green.50',
    color: 'white',
    icon: <GrassIcon />,
  },
  bug: {
    primary: 'green.600',
    secondary: 'green.50',
    color: 'white',
    icon: <BugIcon />,
  },
  water: {
    primary: 'blue.400',
    secondary: 'blue.50',
    color: 'white',
    icon: <WaterIcon />,
  },
  fairy: {
    primary: 'pink.500',
    secondary: 'pink.50',
    color: 'white',
    icon: <FairyIcon />,
  },
  ice: {
    primary: 'teal.300',
    secondary: 'teal.50',
    color: 'white',
    icon: <IceIcon />,
  },
  ghost: {
    primary: 'blue.500',
    secondary: 'blue.50',
    color: 'white',
    icon: <GhostIcon />,
  },
  flying: {
    primary: 'cyan.500',
    secondary: 'cyan.50',
    color: 'white',
    icon: <FlyingIcon />,
  },
  normal: {
    primary: 'gray.500',
    secondary: 'gray.50',
    color: 'white',
    icon: <NormalIcon />,
  },
  steel: {
    primary: 'blue.800',
    secondary: 'gray.50',
    color: 'white',
    icon: <SteelIcon />,
  },
  dark: {
    primary: 'gray.900',
    secondary: 'gray.50',
    color: 'white',
    icon: <DarkIcon />,
  },
  poison: {
    primary: 'purple.700',
    secondary: 'purple.50',
    color: 'white',
    icon: <PoisonIcon />,
  },
  psychic: {
    primary: 'purple.900',
    secondary: 'purple.50',
    color: 'white',
    icon: <PsychicIcon />,
  },
  fire: {
    primary: 'red.500',
    secondary: 'red.50',
    color: 'white',
    icon: <FireIcon />,
  },
  electric: {
    primary: 'yellow.500',
    secondary: 'yellow.50',
    color: 'blackAlpha.800',
    icon: <ElectricIcon />,
  },
  fighting: {
    primary: 'orange.300',
    secondary: 'orange.50',
    color: 'white',
    icon: <FightingIcon />,
  },
  ground: {
    primary: 'orange.500',
    secondary: 'orange.50',
    color: 'white',
    icon: <GroundIcon />,
  },
  rock: {
    primary: 'orange.700',
    secondary: 'orange.50',
    color: 'white',
    icon: <RockIcon />,
  },
  dragon: {
    primary: 'cyan.800',
    secondary: 'blue.50',
    color: 'white',
    icon: <DragonIcon />,
  },
}
