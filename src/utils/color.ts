export function colorFrequency(imageData: any, topColors: number) {
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
      const mapColor = colorFrequencyMap.get(color) ?? 0
      colorFrequencyMap.set(color, mapColor + 1)
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

export async function getImageData(url: string) {
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

type RGB = [number, number, number]

export function getContrast(rgb: RGB) {
  const [r, g, b] = rgb.map((val: number) => {
    val /= 255 // Normalize to 0-1 range
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
  })

  // Calculate the luminance value
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b

  return luminance > 0.21 ? 'dark' : 'light'
  return luminance > 0.179 ? 'dark' : 'light'
}
