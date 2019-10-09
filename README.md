hypercore-block-request
=======================

> Linearly download the blocks in a sparse Hypercore feed.

## Installation

```sh
$ npm install hypercore-block-request
```

## Usage

```js
const download = require('hypercore-block-request')

// download all blocks until end of feed in strides of 4
// in sets of 2 concurrent download requests starting at block 3
download(feed, { start: 3, concurrency: 2, stride: 4 }, (err) => {
  // download complete
})
```

## API

### `download(feed, opts, callback)`

Linearly download the blocks in a sparse Hypercore feed where `opts`
can be:

```js
{
  // called every time a range of blocks is downloaded
  ondownload(start, end, downloaded, feedLength) {}
  // the max number of concurrency download requests
  concurrency: 4,
  // describes the stride offset in blocks per download requests
  stride: 2,
}
```

```js
download(feed, opts, (err) => {
  // download complete
})
```

## License

MIT
