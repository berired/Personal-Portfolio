import * as THREE from 'three'

// A soft, rounded-corner falloff mask for the screen plane. The monitor's
// case has a curved/beveled front around the glass — a hard-edged rectangle
// sitting on top of it visibly clips against that curve at the corners
// (occluded unevenly by the bezel). A feathered rounded mask reads as glass
// set into a curved case instead of a flat sticker, and it doesn't require
// knowing the case's exact curvature, just fading out before reaching it.
let cached = null

export function screenMaskTexture() {
  if (cached) return cached

  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')

  const radius = size * 0.14
  const inset = size * 0.06

  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, size, size)

  // Rounded-rect core, fully opaque.
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.moveTo(inset + radius, inset)
  ctx.arcTo(size - inset, inset, size - inset, size - inset, radius)
  ctx.arcTo(size - inset, size - inset, inset, size - inset, radius)
  ctx.arcTo(inset, size - inset, inset, inset, radius)
  ctx.arcTo(inset, inset, size - inset, inset, radius)
  ctx.closePath()
  ctx.fill()

  // Feather the edge so it fades rather than cuts, then a soft central
  // brightening so light reads as curving off toward the rim — a cheap
  // stand-in for a true curved-glass highlight.
  ctx.filter = 'blur(10px)'
  ctx.drawImage(canvas, 0, 0)
  ctx.filter = 'none'

  const glow = ctx.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size * 0.55
  )
  glow.addColorStop(0, 'rgba(255,255,255,0.35)')
  glow.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.globalCompositeOperation = 'lighten'
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, size, size)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  cached = texture
  return texture
}
