module.exports = function(context, givenOpts) {
  const opts = givenOpts || {}
  const config = {
    plugins: [
      [
        require.resolve('motion-hmr'),
        {
          decoratorName: opts.decorator || 'view',
          transforms: [
            {
              transform: require.resolve('motion-hmr-view'),
              imports: ['react'],
              locals: ['module'],
            },
          ],
        },
      ],
      // order important here
      require.resolve('babel-plugin-transform-decorators-legacy'),
      require.resolve('babel-plugin-transform-class-properties'),
      [
        require.resolve('gloss/transform'),
        {
          decoratorName: opts.decorator || 'view',
          jsxIf: opts.jsxIf || true,
        },
      ],
      [
        require.resolve('babel-plugin-root-import'),
        [{ rootPathPrefix: '~', rootPathSuffix: 'src' }],
      ],
    ],
    presets: [
      [
        require.resolve('babel-preset-env'),
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
      require.resolve('babel-preset-react'),
      require.resolve('babel-preset-stage-1'),
    ],
  }

  return config
}
