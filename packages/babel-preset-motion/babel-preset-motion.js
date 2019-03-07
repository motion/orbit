module.exports = function(_, givenOpts) {
  const isDev = process.env.NODE_ENV !== 'production'
  const opts = givenOpts || {}
  const disable = opts.disable || []

  const plug = (name, plOpts) => {
    if (disable.find(x => x === name)) {
      return null
    }
    const plugin = require.resolve(name)
    return plOpts ? [plugin, plOpts] : plugin
  }

  const config = {
    plugins: [
      isDev && plug('react-hot-loader/babel'),
      plug('./babel-plugin-react-displayname.js'),
      plug('@babel/plugin-syntax-dynamic-import'),
      plug('@babel/plugin-transform-runtime', {
        regenerator: false,
      }),
      plug('@o/gloss-displaynames', opts.glossDisplayNameConfig || {}),
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
        // modules: false,
        targets: {
          chrome: '73',
          esmodules: true,
        },
        ...opts.env,
      }),
      !opts.disableTypeScript && plug('@babel/preset-typescript'),
    ],
  }

  config.plugins = config.plugins.filter(Boolean)
  config.presets = config.presets.filter(Boolean)

  console.log('Using babel config', config)

  return config
}
