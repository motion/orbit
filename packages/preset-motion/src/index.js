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
      // getPlugin('babel-plugin-transform-runtime'),
      // order important here
      getPlugin('babel-plugin-transform-decorators-legacy-without-clutter'),
      getPlugin('babel-plugin-transform-class-properties'),
      getPlugin('@mcro/gloss/transform', {
        decoratorName: opts.decorator || 'view',
        jsxIf: opts.jsxIf || true,
      }),
      getPlugin('babel-plugin-root-import', [
        { rootPathPrefix: '~', rootPathSuffix: 'src' },
      ]),
      getPlugin('@mcro/hmr', {
        decoratorName: opts.decorator || 'view',
        transforms: [
          {
            transform: require.resolve('@mcro/hmr-view'),
            imports: ['react'],
            locals: ['module'],
          },
        ],
      }),
    ],
    presets: [
      [
        getPlugin('babel-preset-env'),
        Object.assign(
          {
            useBuiltIns: true,
            targets: {
              node: 8,
            },
            exclude: ['transform-regenerator', 'transform-async-to-generator'],
          },
          opts.env || {}
        ),
      ],
      getPlugin('babel-preset-react'),
      getPlugin('babel-preset-stage-1-without-async'),
    ],
  }

  config.plugins = config.plugins.filter(x => !!x)
  config.presets = config.presets.filter(x => !!x)

  // console.log(JSON.stringify(config, null, 2))

  return config
}
