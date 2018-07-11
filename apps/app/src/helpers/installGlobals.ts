if (process.env.NODE_ENV === 'production') {
  require('./installProd')
} else {
  require('./installDevTools')
}
