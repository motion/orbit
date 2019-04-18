import { writeJSON } from 'fs-extra'
import webpack from 'webpack'
import makeConfig from './webpack.config'

process.env.NODE_ENV = process.env.NODE_ENV || 'production'

console.log('building for prod... process.env.NODE_ENV', process.env.NODE_ENV)

async function main() {
  const finalConfig = {
    mode: 'production',
    ...(await makeConfig()),
  }

  // console.log(JSON.stringify(finalConfig, null, 2))

  webpack(finalConfig, async (err, stats) => {
    if (err) {
      console.log(err)
      return
    }
    console.log(
      stats.toString({
        colors: true,
        verbose: true,
      }),
    )

    await writeJSON('/tmp/stats.json', stats.toJson())

    process.exit(0)
  })
}

main()
