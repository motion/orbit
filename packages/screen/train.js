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
        font-size: 27px;
        letter-spacing: 2px;
        line-height: 50px;
      }
      .light { font-weight: 300; }
      p { margin: 0; }
    </style>
  </head>
  <body>
    <p>
      <b>*a'b,c;d:e.f?g!h#i$j[k]l(m)</b>
    </p>
    <p>
     <b>the quick brown fox jumps over the lazy dog</b>
    </p>
    <p>
      <b>Cwm FJORD BANK GLyphs VEXT Quiz</b>
    </p>
    <p>pack my box with</p>
    <p>
      five dozen liuor usxcs PACK MY BOX WITH
    </p>
    <p>
      <b>Jackdaws love</b>
    </p>
    <p>
      JACKDAWS LOVE my big sphinx of quartz
    </p>
    <p>
      <i>Im stll skeptcalxzr</i> MY BIG SPHINX OF QUARTZ
    </p>
    <p class="light">promising than any oxen maneuver</p>
    <p class="light">incentivizes dating sites to keep you single</p>
    <p class="light">safter all the longer youre single</p>
    <p>
      *a'b,c;d:e.f?g!h#i$j[k]l(m)
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
    'eurostile',
    'helvetica neue',
    'abraham lincoln',
    'atlas grotesk',
    'aw conqueror sans',
    'axis',
    'bernard mt condensed',
    'bookman old style',
    'calenda plus',
    'cambria',
    'chalkboard',
    'chaparral pro',
    'chochin',
    'consolas',
    'times new roman',
    'fira mono',
    'franklin gothic medium',
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
            width: 850,
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
