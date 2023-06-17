import { chakra } from '@chakra-ui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { motion } from 'framer-motion'
import { ComponentProps } from 'react'

const MotionIcon = motion(
  chakra(FontAwesomeIcon, {
    shouldForwardProp: () => true,
  }),
  {
    forwardMotionProps: true,
  },
)

export default MotionIcon

export type IconProps = ComponentProps<typeof MotionIcon>
