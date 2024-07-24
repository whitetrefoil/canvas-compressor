import EXIF from 'exif-js'
import pDefer from 'p-defer'
import type {IDimension} from './interfaces/dimension.js'


/**
 * Rotate for EXIF "Orientation = 1" or unspecified:
 * Do nothing
 *
 * @returns Whether the width and height were swapped.
 */
function rotate1(dimen: IDimension, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): boolean {
  canvas.width = dimen.width
  canvas.height = dimen.height
  return false
}

/**
 * Rotate for EXIF "Orientation = 2":
 * Flipped horizontally
 *
 * @returns Whether the width and height were swapped.
 */
function rotate2(dimen: IDimension, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): boolean {
  canvas.width = dimen.width
  canvas.height = dimen.height
  context.translate(canvas.width/2, 0)
  context.scale(-1, 1)
  context.translate(canvas.width/ -2, 0)
  return false
}

/**
 * Rotate for EXIF "Orientation = 3":
 * Rotated 180 deg
 *
 * @returns Whether the width and height were swapped.
 */
function rotate3(dimen: IDimension, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): boolean {
  canvas.width = dimen.width
  canvas.height = dimen.height
  context.translate(canvas.width/2, canvas.height/2)
  context.rotate(Math.PI)
  context.translate(canvas.width/ -2, canvas.height/ -2)
  return false
}

/**
 * Rotate for EXIF "Orientation = 4":
 * Flipped vertically
 *
 * @returns Whether the width and height were swapped.
 */
function rotate4(dimen: IDimension, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): boolean {
  canvas.width = dimen.width
  canvas.height = dimen.height
  context.translate(0, canvas.height/2)
  context.scale(1, -1)
  context.translate(0, canvas.height/ -2)
  return false
}

/**
 * Rotate for EXIF "Orientation = 5":
 * Flipped horizontally then rotated 270 deg
 *
 * @returns Whether the width and height were swapped.
 */
function rotate5(dimen: IDimension, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): boolean {
  canvas.width = dimen.height
  canvas.height = dimen.width
  context.translate(canvas.width/2, canvas.height/2)
  context.scale(-1, 1)
  context.rotate(Math.PI*0.5)
  context.translate(canvas.height/ -2, canvas.width/ -2)
  return true
}

/**
 * Rotate for EXIF "Orientation = 6"：
 * Rotated 90 deg
 *
 * @returns Whether the width and height were swapped.
 */
function rotate6(dimen: IDimension, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): boolean {
  canvas.width = dimen.height
  canvas.height = dimen.width
  context.translate(canvas.width/2, canvas.height/2)
  context.rotate(Math.PI*0.5)
  context.translate(canvas.height/ -2, canvas.width/ -2)
  return true
}

/**
 * Rotate for EXIF "Orientation = 7"：
 * Flipped horizontally then rotated 90 deg
 *
 * @returns Whether the width and height were swapped.
 */
function rotate7(dimen: IDimension, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): boolean {
  canvas.width = dimen.height
  canvas.height = dimen.width
  context.translate(canvas.width/2, canvas.height/2)
  context.scale(-1, 1)
  context.rotate(Math.PI*1.5)
  context.translate(canvas.height/ -2, canvas.width/ -2)
  return true
}

/**
 * Rotate for EXIF "Orientation = 8"：
 * Rotated 270 deg
 *
 * @returns Whether the width and height were swapped.
 */
function rotate8(dimen: IDimension, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): boolean {
  canvas.width = dimen.height
  canvas.height = dimen.width
  context.translate(canvas.width/2, canvas.height/2)
  context.rotate(Math.PI*1.5)
  context.translate(canvas.height/ -2, canvas.width/ -2)
  return true
}

/**
 * @returns Whether the width & height are swapped.
 */
export async function fixRotation(
  img: HTMLImageElement,
  dimen: IDimension,
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
): Promise<boolean> {

  const deferred = pDefer<boolean>()

  EXIF.getData(img, function() {
    const orientation = EXIF.getTag(this, 'Orientation')

    let isDimenSwapped = false

    switch (orientation) {
      case 1:
        isDimenSwapped = rotate1(dimen, canvas, context)
        break
      case 2:
        isDimenSwapped = rotate2(dimen, canvas, context)
        break
      case 3:
        isDimenSwapped = rotate3(dimen, canvas, context)
        break
      case 4:
        isDimenSwapped = rotate4(dimen, canvas, context)
        break
      case 5:
        isDimenSwapped = rotate5(dimen, canvas, context)
        break
      case 6:
        isDimenSwapped = rotate6(dimen, canvas, context)
        break
      case 7:
        isDimenSwapped = rotate7(dimen, canvas, context)
        break
      case 8:
        isDimenSwapped = rotate8(dimen, canvas, context)
        break
      default:
        // Unknown tag or no EXIF exists.
        isDimenSwapped = rotate1(dimen, canvas, context)
    }

    deferred.resolve(isDimenSwapped)
  })

  return deferred.promise
}
