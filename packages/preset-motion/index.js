module.exports = function(context, givenOpts) {
  return {
    plugins: [
      require.resolve('babel-plugin-transform-decorators-legacy'),
      [
        require.resolve('gloss/transform'),
        {
          decoratorName: 'view',
          jsxIf: true,
        },
      ],
      [
        require.resolve('babel-plugin-root-import'),
        {
          rootPathSuffix: 'app',
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
          givenOpts
        ),
      ],
      require.resolve('babel-preset-react'),
      require.resolve('babel-preset-stage-1'),
    ],
  }
}
