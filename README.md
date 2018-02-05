Image Compressor (via \<canvas>)
=====================================================

A simple in browser image compressor.
It creates an in-memory canvas
then use it to compress the image.

Important
---------

1. This module is designed to be used in browsers only.
2. If your code isn't targeting the latest syntax spec of JS / ES,
please use something like babel to transfer this library.

Usage
-----

### Notice

1. This module will only reduce the size of image.
If the image is small enough to the given options,
it will return the original image directly.
(JPEG compression will not be applied!)
2. This module will try to keep the aspect radio intact,
but the fractional part may be lost during resizing.

### Step 1: Create a Compressor w/ Options

```typescript
import { Compressor } from '@whitetrefoil/canvas-compressor'

const compressor = new Compressor(options)
```

Available options:

**NOTICE**: Only one of below options can be given, an error will be thrown otherwise.

* `maxWidth: number` - reduce the width to this value, reduce the height accordingly.
* `maxHeight: number` - reduce the height to this value, reduce the width accordingly.
* `maxPixels: number` - reduce the total pixels to this value.

### Step 2: Compress the Image

```typescript
const compressed = compressor.compress(dataUrl)
```

### Step 3: Export the Result

```typescript
compressed.toUrl().then((compressedUrl) => { doSomethingTo(compressedUrl) })
```

There are 6 export methods, all of them return **PROMISE**:

* `toPngUrl(): Promise<string>` - Output a PNG image in DataUrl.
* `toJpgUrl(q=0.9): Promise<string>` - Output a JPEG image compressed to given quality in DataUrl.
* `toUrl(q=0.9): Promise<string>` - Will try both of above then output the smaller one.
* `toPngBlob(): Promise<Blob>` - Output a PNG image in Blob.
* `toJpgBlob(q=0.9): Promise<Blob>` - Output a JPEG image compressed to given quality in Blob.
* `toBlob(q=0.9): Promise<Blob>` - Similar to `toUrl(q)` but will output image in Blob instead.

### Simple example
```typescript
import { Compressor } from '@whitetrefoil/canvas-compressor'

const MAX_PIXELS = 400 * 300

onChange(ev: Event) {
  const input = ev.currentTarget as HTMLInputElement

  if (input.files == null || input.files[0] == null) { return }

  const file    = input.files[0]
  const reader  = new FileReader()
  reader.onload = (e) => {
    const url = (e.target as FileReader).result

    new Compressor({ maxPixels: MAX_PIXELS })
      .compress(url)
      .toUrl()
      .then((compressedUrl) => {
        this.setState({ compressedUrl })
      }, (err) => {
        console.error(err.message)
      })
  }

  reader.readAsDataURL(file)
}

```

Changelog & Roadmap
-------------------

### v0.1.0

* Initial release.
