const replicate = require('hypercore-replicate')
const hypercore = require('hypercore')
const download = require('./')
const crypto = require('crypto')
const ready = require('hypercore-ready')
const test = require('tape')
const ram = require('random-access-memory')

test('download(feed, opts, done)', (t) => {
  const origin = hypercore(ram)
  const bytes = crypto.randomBytes(64)
  origin.ready(() => {
    const destination = hypercore(ram, origin.key, { sparse: true })
    const stream = origin.createWriteStream()
    const edge = hypercore(ram, origin.key, { })

    for (const byte of bytes) {
      stream.write(Buffer.from([byte]))
    }

    stream.end()

    ready(edge, destination, () => {
      let i = 0
      t.ok(0 === destination.downloaded())
      download(destination, { ondownload }, (err) => {
        t.notOk(err)
        t.equal(i, destination.length)
        t.end()
      })

      replicate(origin, edge, { live: true })
      replicate(edge, destination, { live: true })

      function ondownload(start, end, downloaded, length) {
        i = downloaded
      }
    })
  })
})
