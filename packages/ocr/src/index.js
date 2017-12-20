// @flow
import NLP from 'google-nlp'
import cheerio from 'cheerio'
import { sortBy } from 'lodash'
import { exec } from 'child_process'
import path from 'path'
import promisify from 'sb-promisify'
import { screen } from '@mcro/screendiff'

//	Google Cloud API key
const apiKey = 'AIzaSyDl_JoYndPs9gDWzbldcvx0th0E5d2iQu0'
const nlp = new NLP(apiKey)

const ocrPath = file => path.resolve(__dirname, '..', file)
const clean = async () => {
  return true
  const cmd = `rm ${ocrPath('tmp')}/*`
  await promisify(exec)(cmd)
}

const ocrFile = async file => {
  const tesseractHocr = ocrPath('tmp/tesseractOutput')
  const tess = `OMP_THREAD_LIMIT=1 tesseract ${file} ${tesseractHocr} --oem 1 -l eng ${ocrPath(
    'hocr',
  )}`

  console.time('tesseract')
  const cmd = `${tess} && cat ${tesseractHocr}.hocr`
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
  const formattedEntities = sortBy(
    entities.map(({ name, salience }) => ({ name, weight: salience })),
  )

  const boxes = formattedEntities.map(({ name, weight }) => {
    const fits = texts.filter(({ text }) => name.indexOf(text.trim()) > -1)
    return {
      name,
      weight,
      box: fits.length > 0 ? fits[0].box : null,
    }
  })

  console.timeEnd('parseWords')
  return { text, boxes }
}

type ScreenOptions = {
  // output screenshot file path
  destination: string,
  // width, height
  bounds: [number, number],
  // left, top
  offset: [number, number],
}

export default async function ocr(options: ScreenOptions) {
  console.time('screenshot')
  const outfile = await screen({
    destination: 'tmp/screenshot-new.png',
    ...options,
  })
  console.timeEnd('screenshot')
  return await ocrFile(ocrPath(outfile))
}
