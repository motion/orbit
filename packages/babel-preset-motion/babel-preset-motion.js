module.exports = function(context, givenOpts) {
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
      // plug('babel-plugin-sitrep'),
      plug('react-hot-loader/babel'),
      plug('@babel/plugin-transform-runtime', {
        polyfill: false,
        regenerator: false,
      }),
      plug('@mcro/gloss-displaynames'),
      plug('@babel/plugin-proposal-export-default-from'),
      plug('@babel/plugin-proposal-class-properties', {
        loose: true,
      }),
      plug('@babel/plugin-proposal-decorators', {
        legacy: true,
      }),
      plug('babel-plugin-root-import', {
        rootPathPrefix: '~',
        rootPathSuffix:
          typeof opts.rootSuffix === 'undefined' ? 'src' : opts.rootSuffix,
      }),
      plug('babel-plugin-lodash'),
    ],
    presets: opts.presets || [
      plug('@babel/preset-react'),
      plug('@babel/preset-stage-2', {
        loose: true,
        decoratorsLegacy: true,
      }),
      plug('@babel/preset-typescript'),
    ],
  }
  config.plugins = config.plugins.filter(x => !!x)
  config.presets = config.presets.filter(x => !!x)
  // console.log('babel config', config)
  return config
}

// plug(
//   '@babel/preset-env',
//   Object.assign(
//     {
//       // this could avoid building es6 altogether, but lets fix stack before testing
//       modules: false,
//       loose: true,
//       useBuiltIns: 'entry',
//       targets: opts.targets || {
//         chrome: '45',
//       },
//       exclude: ['transform-regenerator', 'transform-async-to-generator'],
//     },
//     opts.env,
//   ),
// ),
