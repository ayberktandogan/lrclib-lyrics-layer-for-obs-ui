export function getDominantColor(image: HTMLImageElement, opacity = 1): string {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Unable to get canvas context.')
  }

  // Set canvas dimensions to match the image
  canvas.width = image.width
  canvas.height = image.height

  // Draw the image onto the canvas
  context.drawImage(image, 0, 0, canvas.width, canvas.height)

  // Get the image data
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data

  // Create an object to store color counts
  const colorCounts: { [key: string]: number } = {}
  let maxCount = 0
  let dominantColor = ''

  // Loop through every pixel
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    const color = `rgba(${r},${g},${b},${opacity})`

    if (colorCounts[color]) {
      colorCounts[color]++
    } else {
      colorCounts[color] = 1
    }

    if (colorCounts[color] > maxCount) {
      maxCount = colorCounts[color]
      dominantColor = color
    }
  }

  return dominantColor
}

export function getContrastColor(rgbaColor: string, opacity = 1): string {
  if (!rgbaColor) return 'rgba(0,0,0,0)'

  // Extract the rgba values using a regular expression
  const rgbaMatch = rgbaColor.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)?\)$/)

  if (!rgbaMatch) {
    throw new Error('Invalid RGBA color format')
  }

  const r = parseInt(rgbaMatch[1], 10)
  const g = parseInt(rgbaMatch[2], 10)
  const b = parseInt(rgbaMatch[3], 10)

  // Calculate the luminance of the color
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  // Return black for bright colors, white for dark colors
  return luminance > 0.5 ? `rgba(0,0,0,${opacity})` : `rgba(255,255,255,${opacity})`
}
