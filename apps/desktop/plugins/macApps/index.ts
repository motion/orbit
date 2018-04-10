import { memoize, search } from 'cerebro-tools'
import { orderBy, lowerCase } from 'lodash'
import getAppsList from './getApps'
import fs from 'fs'

const getAbbr = name =>
  lowerCase(name)
    .split(' ')
    .map(word => word[0])
    .join('')

const WATCH_DIRECTORIES = ['/Applications/']
const WATCH_OPTIONS = {
  recursive: true,
}
const CACHE_TIME = 30 * 60 * 1000

const cachedAppsList = memoize(getAppsList, {
  length: false,
  promise: 'then',
  maxAge: CACHE_TIME,
  preFetch: true,
})

const toString = app =>
  `${app.name} ${app.filename.replace(/\.app$/, '')} ${getAbbr(app.name)}`

export const fn = ({ term, actions, display }) => {
  cachedAppsList().then(items => {
    const result = orderBy(
      search(items, term, toString),
      [
        ({ useCount }) => (useCount ? parseInt(useCount, 10) : 0),
        ({ lastUsed = '0000' }) => lastUsed,
      ],
      ['desc', 'desc'],
    ).map(file => {
      const { path, name } = file
      return {
        id: path,
        title: name,
        term: name,
        icon: path,
        subtitle: path,
        clipboard: path,
        integration: 'apps',
      }
    })
    display(result)
  })
}

export const initialize = () => {
  const recache = () => {
    cachedAppsList.clear()
    cachedAppsList()
  }
  setInterval(recache, CACHE_TIME * 0.95)
  recache()
  WATCH_DIRECTORIES.forEach(dir => {
    fs.watch(dir, WATCH_OPTIONS, recache)
  })
}
