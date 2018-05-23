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
      plug('react-hot-loader/babel'),
      // plug('babel-plugin-transform-runtime', {
      //   polyfill: true,
      //   regenerator: true,
      // }),
      plug('@mcro/babel-plugin-if'),
      plug('@mcro/gloss/transform', {
        decoratorName: opts.decorator || 'view',
      }),
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
      plug('babel-plugin-transform-react-jsx', {
        pragma: '__dom',
      }),
      plug('babel-plugin-lodash'),
    ],
    presets: opts.presets || [
      // plug(
      //   'babel-preset-env',
      //   Object.assign(
      //     {
      //       // this could avoid building es6 altogether, but lets fix stack before testing
      //       // modules: process.env.MODULES ? false : true,
      //       useBuiltIns: 'entry',
      //       targets: opts.targets || {
      //         node: opts.nodeTarget || '10',
      //       },
      //       exclude: [
      //         'transform-regenerator',
      //         'babel-plugin-transform-regenerator',
      //         'transform-async-to-generator',
      //       ],
      //     },
      //     opts.env,
      //   ),
      // ),
      plug('@babel/preset-react'),
      plug('@babel/preset-stage-2', {
        loose: true,
        decoratorsLegacy: true,
      }),
    ],
  }

  config.plugins = config.plugins.filter(x => !!x)
  config.presets = config.presets.filter(x => !!x)

  console.log('config', config)
  return config
}
