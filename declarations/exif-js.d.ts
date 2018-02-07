declare module 'exif-js' {
  namespace EXIF {
    type Image = HTMLImageElement
    type Tag = 'Orientation'
    type Orientation = 1|2|3|4|5|6|7|8

    function getData(img: HTMLImageElement, callback: (this: Image) => void)

    function getTag(img: Image, tag: Tag): Orientation
    function getTag(img: Image, tag: string): any

    function getAllTags(img: Image): any
  }

  export = EXIF
}
