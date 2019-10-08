const Batch = require('batch')
const once = require('once')

const DOWNLOAD_CONCURRENCY = 4
const STRIDE_BLOCKS = 2

function download(feed, opts, done) {
  if ('function' === typeof opts) {
    done = opts
    opts = {}
  }

  if (null === opts || 'object' !== typeof opts) {
    opts = {}
  }

  const {
    concurrency = DOWNLOAD_CONCURRENCY,
    stride = STRIDE_BLOCKS,
    linear = true,
    start,
    end,
  } = opts

  const batch = new Batch().concurrency(concurrency)

  if ('function' !== typeof done) {
    done = () => void 0
  }

  done = once(done)

  return 0 === feed.length ? feed.update(onready) : feed.ready(onready)

  function onready() {
    for (
      let i = start || feed.downloaded();
      i < (end || feed.length);
      i += stride
    ) {
      batch.push(visit(i, i + stride))
    }

    batch.end(done)
  }

  function visit(start, end) {
    return (next) => {
      end = Math.min(feed.length, end)

      feed.download({ linear, start, end }, (err) => {
        if (err) { return next(err) }

        if ('function' === typeof opts.ondownload) {
          opts.ondownload(start, end, feed.downloaded(), feed.length)
        }

        next(null)
      })
    }
  }
}

module.exports = Object.assign(download, {
  STRIDE_BLOCKS
})
