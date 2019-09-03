import webpack from 'webpack'

import makeConfig from './webpack.config'

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

console.log('RUNNING')

async function main() {
  const finalConfig = {
    mode: 'development',
    ...(await makeConfig()),
  }

  // console.log(JSON.stringify(finalConfig, null, 2))

  webpack(finalConfig as any, async (err, stats) => {
    if (err) {
      console.log(err)
      return
    }
    console.log(
      stats.toString({
        colors: true,
      }),
    )
  })
}

main()
