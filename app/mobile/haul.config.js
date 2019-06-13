import { createWebpackConfig } from 'haul'
import { join } from 'path'

export default {
  webpack: env => {
    const config = createWebpackConfig({
      entry: './index.js',
    })(env)

    config.resolve.alias = {
      ...config.resolve.alias,
      'react-native': join(__dirname, 'node_modules/react-native'),
    }

    config.resolve.mainFields = [...config.resolve.mainFields, 'ts:main']

    config.resolve.extensions = [...config.resolve.extensions, 'ts', 'tsx']

    config.module.rules = [
      ...config.module.rules,
      {
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
      },
      {
        test: /\.css$/,
        use: 'ignore-loader',
      },
    ]

    config.node = {
      ...(config.node || null),
      fs: 'empty',
    }

    config.externals = [
      ...(config.externals || []),
      {
        electron: '{}',
      },
    ]

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
