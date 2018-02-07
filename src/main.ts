import { defer }       from '@whitetrefoil/deferred'
import * as Pica       from 'pica'
import { Compressed }  from './compressed'
import { IDimension }  from './interfaces/dimension'
import { fixRotation } from './rotate'

export interface ICompressorOptions {
  maxWidth?: number
  maxHeight?: number
  maxPixels?: number
  picaConfig?: Pica.Config
  ResizeOptions?: Pica.ResizeOptions
}

const DEFAULT_RESIZE_OPTIONS: Pica.ResizeOptions = {
  quality         : 3,
  unsharpAmount   : 80,
  unsharpRadius   : 0.6,
  unsharpThreshold: 2,
}

export class Compressor implements ICompressorOptions {

  maxWidth?: number
  maxHeight?: number
  maxPixels?: number
  picaConfig?: Pica.Config
  ResizeOptions?: Pica.ResizeOptions

  private pica: Pica

  constructor(options: ICompressorOptions) {
    if (!this.isOptionsValid(options)) {
      throw new Error('The compressor can have only EXACT ONE parameter.')
    }

    if (options.maxWidth != null) { this.maxWidth = options.maxWidth }
    if (options.maxHeight != null) { this.maxHeight = options.maxHeight }
    if (options.maxPixels != null) { this.maxPixels = options.maxPixels }
    if (options.picaConfig != null) { this.picaConfig = options.picaConfig }
    if (options.ResizeOptions != null) {
      this.ResizeOptions = { ...DEFAULT_RESIZE_OPTIONS, ...options.ResizeOptions }
    } else {
      this.ResizeOptions = DEFAULT_RESIZE_OPTIONS
    }
    this.pica = new Pica(options.picaConfig)
  }

  /**
   * Compress an image encoded in DataUrl.
   */
  compress(dataUrl: string): Compressed {
    const deferred = defer<HTMLCanvasElement>()

    if (!this.isOptionsValid()) {
      deferred.reject(new Error('The compressor can have only EXACT ONE parameter.'))
      return new Compressed(deferred.promise)
    }

    const canvas = document.createElement('canvas')
    const img    = new Image()

    img.onload = () => {

      const ctx = canvas.getContext('2d')

      if (ctx == null) {
        deferred.reject(new Error('Failed to get 2D context of canvas'))
        return
      }

      let dimen: IDimension

      if (this.maxWidth != null) {
        dimen = this.zoomByWidth(img, this.maxWidth)
      } else if (this.maxHeight != null) {
        dimen = this.zoomByHeight(img, this.maxHeight)
      } else if (this.maxPixels != null) {
        dimen = this.zoomByPixels(img, this.maxPixels)
      } else {
        deferred.reject(new Error('Compressor parameter error.'))
        return new Compressed(deferred.promise)
      }

      fixRotation(img, dimen, canvas, ctx)
        .then(() => {
          const tempCanvas  = document.createElement('canvas')
          tempCanvas.width  = dimen.width
          tempCanvas.height = dimen.height
          return this.pica.resize(img, tempCanvas, this.ResizeOptions)
        })
        .then((resizedCanvas) => ctx.drawImage(resizedCanvas, 0, 0, dimen.width, dimen.height))
        .then(() => { deferred.resolve(canvas) })
    }

    img.src = dataUrl

    return new Compressed(deferred.promise)
  }

  private isOptionsValid(options: ICompressorOptions = this): boolean {
    let optionCount = 0
    if (options.maxPixels != null) { optionCount += 1 }
    if (options.maxWidth != null) { optionCount += 1 }
    if (options.maxHeight != null) { optionCount += 1 }
    return optionCount === 1
  }

  private zoomByWidth(dimen: IDimension, width: number): IDimension {
    if (dimen.width <= width) { return dimen }
    const height = dimen.height / (dimen.width / width)
    return { width, height }
  }

  private zoomByHeight(dimen: IDimension, height: number): IDimension {
    if (dimen.height <= height) { return dimen }
    const width = dimen.width / (dimen.height / height)
    return { width, height }
  }

  private zoomByPixels(dimen: IDimension, pixels: number): IDimension {
    const originalPixels = dimen.width * dimen.height
    if (originalPixels <= pixels) { return dimen }
    const zoom = Math.sqrt(originalPixels / pixels)
    return {
      width : dimen.width / zoom,
      height: dimen.height / zoom,
    }
  }
}

export default Compressor
