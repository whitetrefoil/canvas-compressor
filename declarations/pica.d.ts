declare module 'pica' {
  namespace Pica {
    type Feature = 'js'|'wasm'|'ww'|'cib'|'all'

    interface Config {
      tile?: number
      features?: Feature[]
      idle?: number
      concurrency?: number
    }

    interface ResizeOptions {
      quality?: number
      alpha?: false
      unsharpAmount?: number
      unsharpRadius?: number
      unsharpThreshold?: number
      cancelToken?: Promise<any>
    }
  }

  class Pica {
    constructor(config?: Pica.Config)

    resize(
      from: HTMLImageElement|HTMLCanvasElement,
      to: HTMLCanvasElement,
      options?: Pica.ResizeOptions,
    ): Promise<HTMLCanvasElement>
  }

  export = Pica
}
