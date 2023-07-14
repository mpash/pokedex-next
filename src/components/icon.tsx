import { chakra, shouldForwardProp } from '@chakra-ui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ComponentProps } from 'react'

const Icon = chakra(FontAwesomeIcon, {
  // shouldForwardProp: () => true,
})

export default Icon

export type IconProps = ComponentProps<typeof Icon>
