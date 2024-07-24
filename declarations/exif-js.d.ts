declare module 'exif-js' {
  type Image = HTMLImageElement
  type Tag = 'Orientation'
  type Orientation = 1|2|3|4|5|6|7|8

  interface EXIFStatic {
    getData: (img: HTMLImageElement, callback: (this: Image) => void) => void
    getTag: (img: Image, tag: Tag) => Orientation
    getTag: (img: Image, tag: string) => unknown
    getAllTags: (img: Image) => unknown
  }

  const EXIFStatic: EXIFStatic

  export = EXIFStatic
}
