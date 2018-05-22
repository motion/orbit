module.exports = function(context, givenOpts) {
  const opts = givenOpts || {}
  const disable = opts.disable || []

  const getPlugin = (name, opts) => {
    if (disable.find(x => x === name)) {
      return null
    }
    const plugin = require.resolve(name)
    return opts ? [plugin, opts] : plugin
  }

  const config = {
    plugins: [
      getPlugin('react-hot-loader/babel'),
      // getPlugin('babel-plugin-transform-runtime', {
      //   polyfill: true,
      //   regenerator: true,
      // }),
      // order important here
      getPlugin('babel-plugin-transform-decorators-legacy-without-clutter'),
      getPlugin('babel-plugin-transform-class-properties'),
      // getPlugin('babel-plugin-sitrep'),
      getPlugin('@mcro/babel-plugin-if'),
      getPlugin('@mcro/gloss/transform', {
        decoratorName: opts.decorator || 'view',
      }),
      getPlugin('babel-plugin-root-import', [
        {
          rootPathPrefix: '~',
          rootPathSuffix:
            typeof opts.rootSuffix === 'undefined' ? 'src' : opts.rootSuffix,
        },
      ]),
      // getPlugin('@mcro/hmr', {
      //   decoratorName: opts.decorator || 'view',
      //   transforms: [
      //     {
      //       transform: '@mcro/hmr-view',
      //       imports: ['react'],
      //       locals: ['module'],
      //     },
      //   ],
      // }),
      getPlugin('babel-plugin-transform-react-jsx', {
        pragma: '__dom',
      }),
    ],
    presets: opts.presets || [
      getPlugin(
        'babel-preset-env',
        Object.assign(
          {
            // this could avoid building es6 altogether, but lets fix stack before testing
            // modules: process.env.MODULES ? false : true,
            useBuiltIns: 'entry',
            targets: opts.targets || {
              node: opts.nodeTarget || '10',
            },
            exclude: [
              'transform-regenerator',
              'babel-plugin-transform-regenerator',
              'transform-async-to-generator',
            ],
          },
          opts.env,
        ),
      ),
      getPlugin('babel-preset-react'),
      getPlugin('babel-preset-stage-1'),
    ],
  }

  config.plugins = config.plugins.filter(x => !!x)
  config.presets = config.presets.filter(x => !!x)

  return config
}
