module.exports = function(context, givenOpts) {
  const opts = givenOpts || {}
  return {
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
      require.resolve('babel-plugin-transform-decorators-legacy'),
      [
        require.resolve('gloss/transform'),
        {
          decoratorName: opts.decorator || 'view',
          jsxIf: opts.jsxIf || true,
        },
      ],
      [
        require.resolve('babel-root-slash-import'),
        {
          rootPathSuffix: 'src',
        },
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
}
