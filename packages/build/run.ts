import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import historyApiFallback from 'connect-history-api-fallback'
import httpProxyMiddleware from 'http-proxy-middleware'
import checkRequiredFiles from 'react-dev-utils/checkRequiredFiles'
import log from './log'
import config from './webpack.config'
import paths from './paths'

if (!checkRequiredFiles([paths.appHtml, paths.appEntry])) {
  console.log('missing files')
  process.exit(1)
}

let compiler

function setupCompiler() {
  compiler = webpack(config)
  compiler.plugin('done', function(stats) {
    log(null, stats)
  })
}

function onProxyError(proxy) {
  return function(err, req, res) {
    var host = req.headers && req.headers.host
    console.log('Proxy error:')
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
    }),
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

function runDevServer(host, port) {
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
    disableHostCheck: true,
    host: host,
  })
  // Our custom middleware proxies requests to /index.html or a remote API.
  addMiddleware(devServer)
  // Launch WebpackDevServer.
  devServer.listen(port, err => {
    if (err) {
      return console.log(err)
    }
    console.log('Starting the development server...', port)
  })
}

const getArg = (name = '', defaultValue = true) => {
  const argIndex = process.argv.indexOf(`--${name}`)
  if (argIndex) {
    if (process.argv[argIndex + 1][0] != '-') {
      return process.argv[argIndex + 1]
    }
    return defaultValue
  }
  return process.env[name.toUpperCase()] || defaultValue
}

function run() {
  const protocol = getArg('https', 'http')
  const host = getArg('host', '0.0.0.0')
  const port = getArg('port', 9000)
  console.log(`App starting on ${protocol}://${host}:${port}`)
  setupCompiler()
  runDevServer(host, port)
}

run()
