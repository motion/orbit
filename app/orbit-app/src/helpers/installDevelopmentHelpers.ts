if (process.env.NODE_ENV === 'development') {
  require('./installDevTools')
} else {
  require('./installProdTools')
}
