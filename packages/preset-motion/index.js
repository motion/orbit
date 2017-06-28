module.exports = function(context, givenOpts) {
  const opts = givenOpts || {}
  const disable = opts.disable || []
  const getPlugin = (name, opts) => {
    if (disable.indexOf(name) !== -1) {
      return
    }
    const plugin = require.resolve(name)
    return opts ? [plugin, opts] : plugin
  }

  const config = {
    plugins: [
      getPlugin('motion-hmr', {
        decoratorName: opts.decorator || 'view',
        transforms: [
          {
            transform: require.resolve('motion-hmr-view'),
            imports: ['react'],
            locals: ['module'],
          },
        ],
      }),
      // order important here
      getPlugin('babel-plugin-transform-decorators-legacy'),
      getPlugin('babel-plugin-transform-class-properties'),
      getPlugin('gloss/transform', {
        decoratorName: opts.decorator || 'view',
        jsxIf: opts.jsxIf || true,
      }),
      getPlugin('babel-plugin-root-import', [
        { rootPathPrefix: '~', rootPathSuffix: 'src' },
      ]),
    ],
    presets: [
      [
        getPlugin('babel-preset-env'),
        Object.assign(
          {
            useBuiltIns: true,
            targets: {
              node: 'current',
              chrome: '40',
            },
            exclude: ['transform-regenerator', 'transform-async-to-generator'],
          },
          opts
        ),
      ],
      getPlugin('babel-preset-react'),
      getPlugin('babel-preset-stage-1'),
    ],
  }

  config.plugins = config.plugins.filter(Boolean)
  config.presets = config.presets.filter(Boolean)

  return config
}
