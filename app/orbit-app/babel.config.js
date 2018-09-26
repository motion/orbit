if (process.env.PUNDLE) {
  module.exports = {
    presets: [
      ['@mcro/babel-preset-motion' /* , { disable: ['react-hot-loader/babel'] } */],
      ['@babel/preset-env', { targets: { node: '7.0' } }],
    ],
  }
} else {
  module.exports = {
    env: {
      development: {
        presets: [['@mcro/babel-preset-motion']],
      },
      production: {
        presets: [['@mcro/babel-preset-motion']],
      },
    },
  }
}
