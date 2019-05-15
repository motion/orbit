module.exports = function(_, givenOpts) {
  const isDev = process.env.NODE_ENV !== 'production'
  const opts = givenOpts || {}
  const disable = opts.disable || []

  let names = []

  const plug = (name, plOpts) => {
    if (disable.find(x => x === name)) {
      return null
    }
    names.push(name)
    const plugin = require.resolve(name)
    return plOpts ? [plugin, plOpts] : plugin
  }

  const config = {
    plugins: [
      isDev && plug('react-hot-loader/babel'),
      plug('gloss-displaynames', opts.glossDisplayNameConfig || {}),
      // plug('gloss-babel-optimize'),
      plug('./babel-plugin-react-displayname.js'),
      plug('@babel/plugin-syntax-dynamic-import'),
      plug('@babel/plugin-transform-runtime', {
        regenerator: false,
        useESModules: true,
      }),
      plug('@babel/plugin-proposal-decorators', {
        legacy: true,
      }),
      plug('@babel/plugin-proposal-class-properties', {
        loose: true,
      }),
      // last so it optimizes
      ...(((!isDev || process.env['OPTIMIZE_REACT']) && [
        plug('babel-plugin-transform-react-remove-prop-types'),
        plug('@babel/plugin-transform-react-inline-elements'),
        plug('@o/plugin-transform-react-constant-elements'),
      ]) ||
        []),
    ].filter(Boolean),
    presets:
      opts.presets ||
      [
        plug('@babel/preset-react', {
          pragmaFrag: 'React.Fragment',
        }),
        plug('@babel/preset-env', {
          loose: true,
          modules: false,
          targets: {
            chrome: '74',
            esmodules: true,
          },
          exclude: ['transform-regenerator', 'transform-async-to-generator'],
          ...opts.env,
        }),
        plug('@babel/preset-typescript'),
      ].filter(Boolean),
  }

  if (!isDev) {
    console.log(`
  Babel config
    disabled: ${disable.join(' ')}
    used:     ${names.join(' ')}
  `)
  }

  return config
}
