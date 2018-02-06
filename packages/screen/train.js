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
        font-size: 26px;
        letter-spacing: 3px;
        line-height: 60px;
      }
      p { margin: 0; }
    </style>
  </head>
  <body>
    <p>
      The quick brown fox*
    </p>
    <p>
      jumped, over the lazy dog.
    </p>
    <p>
      Cwm FJORD BANK GLyphs VEXT Quiz!
    </p>
    <p>
      pack my box with #!@$[];:
    </p>
    <p>
      PACK MY BOX WITH #!@$[];:
    </p>
    <p>
      (five dozen liquor jugs) #!@$[];:
    </p>
    <p>
      <b>Jackdaws' love,</b>
    </p>
    <p>
      JACKDAWS LOVE,
    </p>
    <p>
      <b>my big sphinx of quartz</b>
    </p>
    <p>
      <i>MY BIG SPHINX of quartz</i>
    </p>
    <p>
      <i>I’m still skeptical.</i>
    </p>
    <p>
      <b>promising than any oxen maneuver</b>
    </p>
    <p>
      <b><i>incentivizes dating sites to keep you single, after all, the longer youre single</i></b>
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

  const fonts = [
    'arial',
    'georgia',
    'verdana',
    'helvetica',
    'rockwell',
    'avenir',
    'century gothic',
    'century schoolbook',
    'consolas',
    'eurostile',
    'garamond regular',
    'gill sans light',
    'goudy old style',
    'gulim',
    'helvetica neue',
    'hiragino sans',
    'kefa regular',
    'lucida bright',
    'lucida sans',
    'myriad pro',
    'optima regular',
    'pt sans',
    'tekton pro',
    'times new roman',
    'trebuchet ms',
    'adobe hebrew',
  ]

  while (fonts.length) {
    const font = fonts.pop()
    await execa(`open`, [`http://localhost:3003/${font}`])
    await sleep(800)
    await new Promise(resolve => {
      screen.onWords(async data => {
        screen.pause()
        await sleep(350) // wait for fs to write all files
        const fontDir = Path.join(trainDir, font)
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
