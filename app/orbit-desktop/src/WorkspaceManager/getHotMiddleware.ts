import { Logger } from '@o/logger'
import { parse } from 'url'
import webpack from 'webpack'

import { createEventStream } from './createEventStream'
import { publishStats } from './publishStats'

const log = new Logger('getHotMiddleware')

const eventStreams = {}

/**
 * This is a lightly modified webpack-hot-middleware for our sakes imported here,
 * so it can be modified to support putting multiple compilers under one EventStream.
 */
export function getHotMiddleware(
  compilers: webpack.Compiler[],
  opts: { path: string; log: Function; heartBeat: number },
) {
  opts.log = typeof opts.log == 'undefined' ? console.log.bind(console) : opts.log
  opts.path = opts.path || '/__webpack_hmr'
  // re-use existing event stream even if we re-run getHotMiddleware
  eventStreams[opts.path] =
    eventStreams[opts.path] || createEventStream(opts.heartBeat || 10 * 1000)
  const eventStream = eventStreams[opts.path]

  let latestStats = null
  let closed = false

  for (const compiler of compilers) {
    if (compiler.hooks) {
      compiler.hooks.invalid.tap('webpack-hot-middleware', onInvalid)
      compiler.hooks.done.tap('webpack-hot-middleware', onDone)
    } else {
      compiler.plugin('invalid', onInvalid)
      compiler.plugin('done', onDone)
    }
    function onInvalid() {
      if (closed) return
      latestStats = null
      if (opts.log) opts.log('webpack building...')
      eventStream.publish({ action: 'building' })
    }
    function onDone(statsResult) {
      if (closed) return
      // Keep hold of latest stats so they can be propagated to new clients
      latestStats = statsResult
      publishStats('built', latestStats, eventStream, opts.log)
    }
  }

  function middleware(req, res, next) {
    if (closed) return next()
    if (!pathMatch(req.url, opts.path)) return next()
    eventStream.handler(req, res)
    if (latestStats) {
      publishStats('sync', latestStats, eventStream, opts.log)
    }
  }

  middleware.publish = payload => {
    if (closed) return
    eventStream.publish(payload)
  }

  middleware.close = () => {
    if (closed) return
    log.info(`Closing hot middleware... shouldnt happen`)
    closed = true
    eventStream.close()
    delete eventStreams[opts.path]
  }

  return middleware
}

const pathMatch = function(url, path) {
  try {
    return parse(url).pathname === path
  } catch (e) {
    return false
  }
}
