import { defer } from '@whitetrefoil/deferred'

export class Compressed {
  private canvasPromise: Promise<HTMLCanvasElement>

  constructor(canvasPromise: Promise<HTMLCanvasElement>) {
    this.canvasPromise = canvasPromise
  }

  /**
   * Output a JPEG image compressed to given quality in DataUrl.
   */
  toJpgUrl(quality = 0.9): Promise<string> {
    return this.canvasPromise.then((canvas) => canvas.toDataURL('image/jpeg', quality))
  }

  /**
   * Output a PNG image in DataUrl.
   */
  toPngUrl(): Promise<string> {
    return this.canvasPromise.then((canvas) => canvas.toDataURL('image/png'))
  }

  /**
   * Try both PNG & JPEG in given quality then output the smaller one in DataUrl.
   */
  toUrl(quality = 0.9): Promise<string> {
    return Promise.all([this.toJpgUrl(quality), this.toPngUrl()])
      .then(([jpg, png]) => jpg.length < png.length ? jpg : png)
  }

  /**
   * Output a JPEG image compressed to given quality in Blob.
   */
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

  /**
   * Output a PNG image in Blob.
   */
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

  /**
   * Try both PNG & JPEG in given quality then output the smaller one in Blob.
   */
  toBlob(quality = 0.9): Promise<Blob> {
    return Promise.all([this.toJpgBlob(quality), this.toPngBlob()])
      .then(([jpg, png]) => jpg.size < png.size ? jpg : png)
  }
}
