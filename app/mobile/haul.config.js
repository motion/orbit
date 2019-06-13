import { createWebpackConfig } from 'haul'

export default {
  webpack: env => {
    const config = createWebpackConfig({
      entry: './index.js',
    })(env)

    config.resolve.mainFields.push('ts:main')

    config.resolve.extensions.push('ts')
    config.resolve.extensions.push('tsx')

    config.module.rules.push({
      test: /\.tsx?$/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: ['@o/babel-preset-motion'],
          },
        },
        'react-hot-loader/webpack',
      ],
    })

    config.module.rules.push({
      test: /\.css$/,
      use: 'ignore-loader',
    })

    config.module.rules.some(rule => {
      if (rule.test && rule.test.source.includes('js')) {
        rule.use = [
          {
            loader: require.resolve('babel-loader'),
            options: {
              presets: [['module:metro-react-native-babel-preset', { enableBabelRuntime: false }]],
              plugins: [require.resolve('haul/src/utils/fixRequireIssues')],
            },
          },
        ]
        return true
      }
    })

    return config
  },
}
