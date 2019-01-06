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
  const isDev = process.env.NODE_ENV !== 'production'
  const config = {
    plugins: [
      isDev && plug('react-hot-loader/babel'),
      plug('@babel/plugin-syntax-dynamic-import'),
      plug('@babel/plugin-transform-runtime', {
        regenerator: false,
      }),
      plug('@mcro/gloss-displaynames', {
        // old and new style
        matchNames: ['gloss', 'view'],
        matchImports: ['@mcro/gloss', '@mcro/black'],
      }),
      plug('@babel/plugin-proposal-decorators', {
        legacy: true,
      }),
      plug('@babel/plugin-proposal-class-properties', {
        loose: true,
      }),
    ],
    presets: opts.presets || [
      plug('@babel/preset-react', {
        pragmaFrag: 'React.Fragment',
      }),
      plug('@babel/preset-env', {
        loose: true,
        targets: {
          chrome: '55',
        },
      }),
      plug('@babel/preset-typescript'),
    ],
  }
  config.plugins = config.plugins.filter(Boolean)
  config.presets = config.presets.filter(Boolean)
  // console.log('babel config', config)
  return config
}
