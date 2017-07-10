export default function(context, givenOpts) {
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
      // getPlugin('@mcro/hmr', {
      //   decoratorName: opts.decorator || 'view',
      //   transforms: [
      //     {
      //       transform: require.resolve('@mcro/hmr-view'),
      //       imports: ['react'],
      //       locals: ['module'],
      //     },
      //   ],
      // }),
      // order important here
      getPlugin('babel-plugin-transform-decorators-legacy'),
      getPlugin('babel-plugin-transform-class-properties'),
      getPlugin('@mcro/gloss/transform', {
        decoratorName: opts.decorator || 'view',
        jsxIf: opts.jsxIf || true,
      }),
      getPlugin('babel-plugin-root-import', [
        { rootPathPrefix: '~', rootPathSuffix: 'src' },
      ]),
      getPlugin('react-hot-loader/babel'),
    ],
    presets: [
      [
        getPlugin('babel-preset-env'),
        Object.assign(
          {
            modules: false,
            useBuiltIns: true,
            targets: {
              node: '4',
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
