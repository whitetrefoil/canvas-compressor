import { defer } from '@whitetrefoil/deferred'

export class Compressed {
  private canvasPromise: Promise<HTMLCanvasElement>

  constructor(canvasPromise: Promise<HTMLCanvasElement>) {
    this.canvasPromise = canvasPromise
  }

  toJpgUrl(quality = 0.9): Promise<string> {
    return this.canvasPromise.then((canvas) => canvas.toDataURL('image/jpeg', quality))
  }

  toPngUrl(): Promise<string> {
    return this.canvasPromise.then((canvas) => canvas.toDataURL('image/png'))
  }

  toUrl(quality = 0.9): Promise<string> {
    return Promise.all([this.toJpgUrl(quality), this.toPngUrl()])
      .then(([jpg, png]) => jpg.length < png.length ? jpg : png)
  }

  toJpgBlob(quality = 0.9): Promise<Blob> {
    const deferred = defer<Blob>()

    this.canvasPromise.then((canvas) => {
      canvas.toBlob((blob) => {
        if (blob == null) {
          deferred.reject(new Error('Failed to generate image blob.'))
          return
        }
        deferred.resolve(blob)
      }, 'image/jpeg', quality)
    })

    return deferred.promise
  }

  toPngBlob(): Promise<Blob> {
    const deferred = defer<Blob>()

    this.canvasPromise.then((canvas) => {
      canvas.toBlob((blob) => {
        if (blob == null) {
          deferred.reject(new Error('Failed to generate image blob.'))
          return
        }
        deferred.resolve(blob)
      }, 'image/png')
    })

    return deferred.promise
  }

  toBlob(quality = 0.9): Promise<Blob> {
    return Promise.all([this.toJpgBlob(quality), this.toPngBlob()])
      .then(([jpg, png]) => jpg.size < png.size ? jpg : png)
  }
}
