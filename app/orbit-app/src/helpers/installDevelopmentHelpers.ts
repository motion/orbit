if (process.env.NODE_ENV === 'production') {
  require('./installProdTools')
} else {
  require('./installDevTools')
}
