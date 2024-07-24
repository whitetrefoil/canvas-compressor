import pDefer from 'p-defer'


export interface IUrl {
  url: string
  width: number
  height: number
}

export interface IBlob {
  blob: Blob
  width: number
  height: number
}

export class Compressed {
  private canvasPromise: Promise<HTMLCanvasElement>

  constructor(canvasPromise: Promise<HTMLCanvasElement>) {
    this.canvasPromise = canvasPromise
  }

  /**
   * Output a JPEG image compressed to given quality in DataUrl.
   */
  async toJpgUrl(quality = 0.9): Promise<IUrl> {
    return this.canvasPromise.then(canvas => ({
      url   : canvas.toDataURL('image/jpeg', quality),
      width : canvas.width,
      height: canvas.height,
    }))
  }

  /**
   * Output a PNG image in DataUrl.
   */
  async toPngUrl(): Promise<IUrl> {
    return this.canvasPromise.then(canvas => ({
      url   : canvas.toDataURL('image/png'),
      width : canvas.width,
      height: canvas.height,
    }))
  }

  /**
   * Try both PNG & JPEG in given quality then output the smaller one in DataUrl.
   */
  async toUrl(quality = 0.9): Promise<IUrl> {
    return Promise.all([this.toJpgUrl(quality), this.toPngUrl()])
      .then(([jpg, png]) => jpg.url.length < png.url.length ? jpg : png)
  }

  /**
   * Output a JPEG image compressed to given quality in Blob.
   */
  async toJpgBlob(quality = 0.9): Promise<IBlob> {
    const deferred = pDefer<IBlob>()

    void this.canvasPromise.then(canvas => {
      canvas.toBlob(blob => {
        if (blob == null) {
          deferred.reject(new Error('Failed to generate image blob.'))
          return
        }

        deferred.resolve({blob, width: canvas.width, height: canvas.height})
      }, 'image/jpeg', quality)
    })

    return deferred.promise
  }

  /**
   * Output a PNG image in Blob.
   */
  async toPngBlob(): Promise<IBlob> {
    const deferred = pDefer<IBlob>()

    void this.canvasPromise.then(canvas => {
      canvas.toBlob(blob => {
        if (blob == null) {
          deferred.reject(new Error('Failed to generate image blob.'))
          return
        }

        deferred.resolve({blob, width: canvas.width, height: canvas.height})
      }, 'image/png')
    })

    return deferred.promise
  }

  /**
   * Try both PNG & JPEG in given quality then output the smaller one in Blob.
   */
  async toBlob(quality = 0.9): Promise<IBlob> {
    return Promise.all([this.toJpgBlob(quality), this.toPngBlob()])
      .then(([jpg, png]) => jpg.blob.size < png.blob.size ? jpg : png)
  }
}
