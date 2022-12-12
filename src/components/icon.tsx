import { chakra } from '@chakra-ui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ComponentProps } from 'react'

const Icon = chakra(FontAwesomeIcon)

export default Icon

export type IconProps = ComponentProps<typeof Icon>
