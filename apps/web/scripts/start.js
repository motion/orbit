process.env.NODE_ENV = 'development'

const chalk = require('chalk')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const historyApiFallback = require('connect-history-api-fallback')
const httpProxyMiddleware = require('http-proxy-middleware')
const detect = require('detect-port')
const clearConsole = require('react-dev-utils/clearConsole')
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles')
const getProcessForPort = require('react-dev-utils/getProcessForPort')
const openBrowser = require('react-dev-utils/openBrowser')
const log = require('./config/log')
const prompt = require('react-dev-utils/prompt')
const fs = require('fs')
const config = require('./config/webpack')
const paths = require('./config/paths')

const useYarn = fs.existsSync(paths.yarnLockFile)
const cli = useYarn ? 'yarn' : 'npm'
const isInteractive = false

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1)
}

// Tools like Cloud9 rely on this.
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3001
let compiler

function setupCompiler(host, port, protocol) {
  // "Compiler" is a low-level interface to Webpack.
  compiler = webpack(config)

  // "done" event fires when Webpack has finished recompiling the bundle.
  // Whether or not you have warnings or errors, you will get this event.
  compiler.plugin('done', function(stats) {
    log(null, stats)
  })
}

// We need to provide a custom onError function for httpProxyMiddleware.
// It allows us to log custom error messages on the console.
function onProxyError(proxy) {
  return function(err, req, res) {
    var host = req.headers && req.headers.host
    console.log(chalk.red('Proxy error:'))

    // And immediately send the proper error response to the client.
    // Otherwise, the request will eventually timeout with ERR_EMPTY_RESPONSE on the client side.
    if (res.writeHead && !res.headersSent) {
      res.writeHead(500)
    }
    res.end(`Proxy error: Could not proxy request ${err.code}`)
  }
}

function addMiddleware(devServer) {
  var proxy = require(paths.appPackageJson).proxy
  devServer.use(
    historyApiFallback({
      disableDotRule: true,
      htmlAcceptHeaders: proxy ? ['text/html'] : ['text/html', '*/*'],
    })
  )

  if (proxy) {
    if (typeof proxy !== 'string') {
      console.log('When specified, "proxy" in package.json must be a string.')
      process.exit(1)
    }

    var mayProxy = /^(?!\/(index\.html$|.*\.hot-update\.json$|sockjs-node\/)).*$/
    var hpm = httpProxyMiddleware(pathname => mayProxy.test(pathname), {
      target: proxy,
      logLevel: 'silent',
      onProxyReq: function(proxyReq) {
        if (proxyReq.getHeader('origin')) {
          proxyReq.setHeader('origin', proxy)
        }
      },
      onError: onProxyError(proxy),
      secure: false,
      changeOrigin: true,
      ws: true,
      xfwd: true,
    })

    devServer.use(mayProxy, hpm)
    devServer.listeningApp.on('upgrade', hpm.upgrade)
  }

  devServer.use(devServer.middleware)
}

function runDevServer(host, port, protocol) {
  var devServer = new WebpackDevServer(compiler, {
    compress: true,
    clientLogLevel: 'none',
    contentBase: paths.appPublic,
    hot: true,
    publicPath: config.output.publicPath,
    quiet: false,
    watchOptions: {
      ignored: /node_modules/,
    },
    https: protocol === 'https',
    host: host,
  })

  // Our custom middleware proxies requests to /index.html or a remote API.
  addMiddleware(devServer)

  // Launch WebpackDevServer.
  devServer.listen(port, err => {
    if (err) {
      return console.log(err)
    }
    console.log(chalk.cyan('Starting the development server...'))
  })
}

function run(port) {
  var protocol = process.env.HTTPS === 'true' ? 'https' : 'http'
  var host = process.env.HOST || 'localhost'
  setupCompiler(host, port, protocol)
  runDevServer(host, port, protocol)
}

// We attempt to use the default port but if it is busy, we offer the user to
// run on a different port. `detect()` Promise resolves to the next free port.
detect(DEFAULT_PORT).then(port => {
  if (port === DEFAULT_PORT) {
    run(port)
    return
  }

  if (isInteractive) {
    clearConsole()
    var existingProcess = getProcessForPort(DEFAULT_PORT)
    var question =
      chalk.yellow(
        'Something is already running on port ' +
          DEFAULT_PORT +
          '.' +
          (existingProcess ? ' Probably:\n  ' + existingProcess : '')
      ) + '\n\nWould you like to run the app on another port instead?'

    prompt(question, true).then(shouldChangePort => {
      if (shouldChangePort) {
        run(port)
      }
    })
  } else {
    console.log('Something is already running on port ' + DEFAULT_PORT + '.')
  }
})
