const colorFrequency = (imageData: any, topColors: number) => {
  const { data } = imageData

  // Create a frequency map of the colors in the image
  const colorFrequencyMap = new Map<string, number>()
  for (let i = 0; i < data.length; i += 4) {
    // Get the red, green, and blue values for the current pixel
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    // Create a string representing the color for this pixel in the format "r,g,b"
    const color = `${r},${g},${b}`

    if (color === '0,0,0') continue

    // Increment the frequency of this color in the map
    if (colorFrequencyMap.has(color)) {
      colorFrequencyMap.set(color, colorFrequencyMap.get(color) + 1)
    } else {
      colorFrequencyMap.set(color, 1)
    }
  }

  // Sort the colors in the frequency map by their frequency
  const sortedColors = [...colorFrequencyMap.entries()].sort(
    (a, b) => b[1] - a[1],
  )

  // Return the top n most frequent colors
  return sortedColors.slice(0, topColors)
}

export default colorFrequency

export const getImageData = async (url: string) => {
  // Create an image object and set its src to the provided url
  const image = new Image()
  image.src = url
  return new Promise((resolve, reject) => {
    image.onload = () => {
      // Create a canvas and draw the image onto it
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      context?.drawImage(image, 0, 0)

      // Return the image data
      const imageData = context?.getImageData(0, 0, canvas.width, canvas.height)
      if (!imageData) {
        reject(new Error('Could not get image data'))
      } else {
        resolve(imageData)
      }
    }
  })
}
