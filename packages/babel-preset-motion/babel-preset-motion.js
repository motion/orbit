module.exports = function(_, givenOpts) {
  const opts = givenOpts || {}
  const disable = opts.disable || []
  const enable = opts.enable || []
  const mode = opts.mode || process.env.NODE_ENV || 'development'
  const isDev = mode === 'development'

  let names = []

  const plug = (name, plOpts, opts) => {
    if (disable.find(x => x === name)) {
      return null
    }
    // disable if not in preferred mode (unless enabled)
    if (opts && opts.usually !== mode && !enable.some(x => x === name)) {
      return null
    }
    names.push(name)
    const plugin = require.resolve(name)
    return plOpts ? [plugin, plOpts] : plugin
  }

  const config = {
    plugins: [
      plug('babel-plugin-lodash', undefined, { usually: 'production' }),
      plug('react-refresh/babel', undefined, { usually: 'development' }),
      plug('./babel-plugin-react-displayname.js', undefined, { usually: 'development' }),
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
      ...((process.env['OPTIMIZE_REACT'] && [
        plug('babel-plugin-transform-react-remove-prop-types'),
        plug('@babel/plugin-transform-react-inline-elements'),
        plug('@o/plugin-transform-react-constant-elements'),
      ]) ||
        []),
    ].filter(Boolean),
    presets:
      opts.presets ||
      [
        plug('gloss/babel', opts.glossConfig || {}, { usually: 'development' }),
        plug('@babel/preset-react', {
          pragmaFrag: 'React.Fragment',
        }),
        plug(
          '@babel/preset-env',
          {
            loose: true,
            modules: false,
            targets: {
              chrome: '74',
              esmodules: true,
            },
            exclude: ['transform-regenerator', 'transform-async-to-generator'],
            ...opts.env,
          },
          undefined,
          {
            usually: 'production',
          },
        ),
        plug('@babel/preset-typescript'),
      ].filter(Boolean),
  }

  // console.log(`
  // Babel config
  //   disabled: ${disable.join(' ')}
  //   used:     ${names.join(' ')}
  // `)

  return config
}
