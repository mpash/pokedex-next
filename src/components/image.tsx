import { chakra } from "@chakra-ui/react"
import NextImage from "next/image"

const Image = chakra(NextImage, {
  shouldForwardProp: (prop) =>
    ["width", "height", "src", "alt", "layout"].includes(prop),
})

export default Image
