import NLP from 'google-nlp'
import cheerio from 'cheerio'
import { sortBy } from 'lodash'
import { exec } from 'child_process'
import Jimp from 'jimp'
import path from 'path'
import screenshot from 'desktop-screenshot'
import { promisify } from 'util'

//	Google Cloud API key
const apiKey = 'AIzaSyDl_JoYndPs9gDWzbldcvx0th0E5d2iQu0'
const nlp = new NLP(apiKey)

const ocrPath = file => path.resolve(__dirname, '..', file)
const clean = async () => {
  const cmd = `rm ${ocrPath('tmp')}/*`
  await promisify(exec)(cmd)
}

const ocr = async file => {
  const tesseractHocr = ocrPath('tmp/tesseractOutput')
  const tess = `${ocrPath(
    'tesseract'
  )} ${file} ${tesseractHocr} -l eng ${ocrPath('hocr')}`
  const cmd = `${tess} && cat ${tesseractHocr}.hocr`
  const { stdout } = await promisify(exec)(cmd)

  const $ = cheerio.load(stdout)
  const parseBox = s =>
    s
      .split(';')[0]
      .split(' ')
      .slice(1)
      .map(i => +i)

  const onlyAlpha = s => s.replace(/\W/g, '')
  const texts = []
  $('span.ocrx_word').each(function() {
    texts.push({
      text: onlyAlpha($(this).text()),
      box: parseBox($(this).attr('title')),
    })
  })

  const text = texts.map(_ => _.text).join(' ')

  const { entities } = await nlp.analyzeEntities(text)
  const formattedEntities = sortBy(
    entities.map(({ name, salience }) => ({ name, weight: salience }))
  )

  const boxes = formattedEntities.map(({ name, weight }) => {
    const fits = texts.filter(({ text }) => name.indexOf(text.trim()) > -1)
    return {
      name,
      weight,
      box: fits.length > 0 ? fits[0].box : null,
    }
  })

  return { text, boxes }
}

const run = async () => {
  const screenFile = ocrPath('tmp/screenshot.png')
  const screenSmallFile = ocrPath('tmp/screenshot-small.png')
  try {
    await promisify(screenshot)(screenFile, {})
    const image = await Jimp.read(screenFile)
    await new Promise(res =>
      image.crop(0, 70, 1300, 600).write(screenSmallFile, res)
    )

    return await ocr(path.resolve(__dirname, screenSmallFile))
  } catch (error) {
    console.log('Screenshot failed', error)
  }
}

export default async () => {
  const val = await run()
  await clean()
  return val
}
