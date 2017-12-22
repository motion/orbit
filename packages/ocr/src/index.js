// @flow
import NLP from 'google-nlp'
import cheerio from 'cheerio'
import { sortBy } from 'lodash'
import { exec } from 'child_process'
import Path from 'path'
import promisify from 'sb-promisify'
import { screen } from '@mcro/screendump'

type OCROptions = {
  inputFile?: 'string',
  takeScreenshot?: boolean,
  bounds?: [number, number], // width, height
  offset?: [number, number], // left, top
}

//	Google Cloud API key
const apiKey = 'AIzaSyDl_JoYndPs9gDWzbldcvx0th0E5d2iQu0'
const nlp = new NLP(apiKey)
const ocrPath = (...path) => Path.resolve(__dirname, '..', ...path)

const ocrFile = async file => {
  const tesseractHocr = ocrPath('tmp/tesseractOutput')
  const tess = `TESSDATA_PREFIX=${ocrPath(
    'tessdata',
  )} OMP_THREAD_LIMIT=1 tesseract ${file} ${tesseractHocr} --oem 1 -l eng ${ocrPath(
    'hocr',
  )}`

  console.time('tesseract')
  const cmd = `${tess} && cat ${tesseractHocr}.hocr`
  console.log('running', cmd)
  const stdout = await promisify(exec)(cmd)
  console.timeEnd('tesseract')

  console.time('parseWords')
  const $ = cheerio.load(stdout)
  const parseBox = s =>
    s
      .split(';')[0]
      .split(' ')
      .slice(1)
      .map(i => +i / 2)

  const onlyAlpha = s => s.replace(/\W/g, '')
  const texts = []
  $('span.ocrx_word').each(function() {
    const text = onlyAlpha($(this).text())
    if (text.length === 0) return
    texts.push({
      text,
      box: parseBox($(this).attr('title')),
    })
  })

  const text = texts.map(_ => _.text).join(' ')

  const { entities } = await nlp.analyzeEntities(text)
  if (!entities) {
    return { text, boxes: [] }
  }
  const formattedEntities = sortBy(
    entities.map(({ name, salience }) => ({ name, weight: salience })),
  )

  const boxes = formattedEntities.map(({ name, weight }) => {
    const fits = texts.filter(({ text }) => name.indexOf(text.trim()) > -1)
    const box1 = fits.length > 0 ? fits[0].box : null
    const box = box1 ? box1.map(x => x * 2) : null
    return {
      name,
      weight,
      box,
    }
  })

  console.timeEnd('parseWords')
  return { text, boxes }
}

async function takeScreenshot(options: OCROptions) {
  console.time('screenshot')
  const destination = ocrPath('tmp', 'screenshot.png')
  console.log('tmp screen to', destination)
  if (options.alt) {
    await screen(...options.offset, ...options.bounds, destination)
  } else {
    await screen({ destination, ...options })
  }
  console.timeEnd('screenshot')
  return destination
}

export default async function ocr(options: OCROptions) {
  if (options.takeScreenshot) {
    options.inputFile = await takeScreenshot(options)
  }
  return await ocrFile(options.inputFile)
}
