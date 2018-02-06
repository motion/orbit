const Screen = require('./es6').default
const Fs = require('fs')
const Path = require('path')
const execa = require('execa')
const express = require('express')

const tmpDir = Path.join(__dirname, 'tmp')
const trainDir = Path.join(__dirname, 'train')
const sleep = ms => new Promise(res => setTimeout(res, ms))

const server = express()
server.get('/:font', (req, res) => {
  console.log('got req', req.params)
  res.send(getPage(req.params.font))
})
server.listen(3003)

function getPage(fontName) {
  console.log('getting', fontName)
  return `
<html>
  <head>
    <style>
      body {
        padding: 20px;
        font-family: ${fontName};
        font-size: 29px;
        letter-spacing: 2px;
        line-height: 31px;
      }
    </style>
  </head>
  <body>
    <p>
      The quick brown fox*
    </p>
    <p>
      jumped over the lazy dog.
    </p>
    <p>
      Cwm fjord BANK GLyphs Vext Quiz!
    </p>
    <p>
      pack my box with? #!@$*=+[]"';:
    </p>
    <p>
      PACK MY BOX WITH? #!@$*=+[]"';:
    </p>
    <p>
      (five dozen liquor jugs) #!@$*=+[]"';:
    </p>
    <p>
      Jackdaws' love,
    </p>
    <p>
      JACKDAWS' LOVE,
    </p>
    <p>
      my big sphinx of quartz
    </p>
    <p>
      MY BIG SPHINX of quartz
    </p>
    <p>
      I’m still skeptical.
    </p>
    <p>
      promising than any
    </p>
    <p>
      incentivizes dating sites to keep you single, after all, the longer you’re single
    </p>
  </body>
</html>
  `
}

const screen = new Screen({ debugBuild: false })

async function train() {
  // reset train dir
  if (Fs.existsSync(trainDir)) {
    await execa('rm', ['-r', trainDir])
  }
  await execa('mkdir', [trainDir])

  await screen.start()

  const fonts = ['arial', 'georgia']

  while (fonts.length) {
    const font = fonts.pop()
    await execa(`open`, [`http://localhost:3003/${font}`])
    await sleep(500)
    await new Promise(resolve => {
      screen.onWords(async data => {
        screen.pause()
        await sleep(350) // wait for fs to write all files
        const fontDir = Path.join(trainDir, font)
        console.log('fontDir', fontDir)
        await execa('mkdir', [fontDir])
        await execa('cp', ['-r', tmpDir, fontDir])
        // await execa('mv', [Path.join(fontDir, 'tmp'), fontDir])
        resolve()
      })
      screen.resume()
      screen.watchBounds({
        fps: 1,
        sampleSpacing: 1,
        sensitivity: 1,
        showCursor: false,
        debug: true,
        boxes: [
          {
            id: 0,
            x: 0,
            y: 24,
            width: 800,
            height: 1200,
            initialScreenshot: true,
            findContent: true,
            screenDir: tmpDir,
          },
        ],
      })
    })
  }
}

try {
  train()
} catch (err) {
  console.log('error', err)
}

process.on('SIGINT', async () => {
  console.log('stopping screen')
  await screen.stop()
  console.log('stoped')
  process.exit(0)
})
