module.exports = function(_, givenOpts) {
  const opts = givenOpts || {}
  const disable = opts.disable || []
  const isDev = opts.mode === 'production' ? false : process.env.NODE_ENV !== 'production'

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
      // plug('babel-plugin-lodash'),
      isDev && plug('react-hot-loader/babel'),
      // plug('babel-plugin-react-native-web', {
      //   commonjs: true,
      // }),
      isDev && plug('./babel-plugin-react-displayname.js'),
      plug('@babel/plugin-syntax-dynamic-import'),
      plug('@babel/plugin-transform-runtime', {
        regenerator: false,
        // careful, can mess with node environments
        useESModules: false,
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
        isDev && plug('gloss/babel', opts.glossConfig || {}),
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
