module.exports = function(_, givenOpts) {
  const opts = givenOpts || {}
  const disable = opts.disable || []
  const plug = (name, opts) => {
    if (disable.find(x => x === name)) {
      return null
    }
    const plugin = require.resolve(name)
    return opts ? [plugin, opts] : plugin
  }
  const config = {
    plugins: [
      plug('react-hot-loader/babel'),
      plug('@babel/plugin-transform-runtime', {
        regenerator: false,
      }),
      plug('@mcro/gloss-displaynames'),
      // plug('@babel/plugin-proposal-export-default-from'),
      plug('@babel/plugin-proposal-decorators', {
        legacy: true,
      }),
      plug('@babel/plugin-proposal-class-properties', {
        loose: true,
      }),
    ],
    presets: opts.presets || [
      plug('@babel/preset-react'),
      plug('@babel/preset-env', {
        loose: true,
        targets: {
          chrome: '55',
        },
      }),
      plug('@babel/preset-typescript'),
    ],
  }
  config.plugins = config.plugins.filter(x => !!x)
  config.presets = config.presets.filter(x => !!x)
  // console.log('babel config', config)
  return config
}
