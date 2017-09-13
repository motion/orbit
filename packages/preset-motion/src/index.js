module.exports = function(context, givenOpts) {
  const opts = givenOpts || {}
  const disable = opts.disable || []
  const noAsync = opts.async === false
  const isAsync = !noAsync
  const getPlugin = (name, opts) => {
    if (disable.find(x => x === name)) {
      return null
    }
    const plugin = require.resolve(name)
    return opts ? [plugin, opts] : plugin
  }

  const envOpts = Object.assign(
    {
      useBuiltIns: true,
      targets: {
        node: 8,
      },
      exclude: isAsync
        ? ['transform-regenerator', 'transform-async-to-generator']
        : [],
    },
    opts.env || {}
  )

  const config = {
    plugins: [
      // getPlugin('babel-plugin-transform-runtime'),
      // order important here
      getPlugin('babel-plugin-transform-decorators-legacy-without-clutter'),
      getPlugin('babel-plugin-transform-class-properties'),
      getPlugin('babel-plugin-sitrep'),
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
      [getPlugin('babel-preset-env'), envOpts],
      getPlugin('babel-preset-react'),
      isAsync && getPlugin('babel-preset-stage-1-without-async'),
      noAsync && getPlugin('babel-preset-stage-1'),
    ],
  }

  config.plugins = config.plugins.filter(x => !!x)
  config.presets = config.presets.filter(x => !!x)

  return config
}
