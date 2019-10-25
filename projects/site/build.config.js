// import { OrbitBuildOptions } from '@o/build'

module.exports = async function buildOptions() {
  return {
    glossOptions: {
      whitelistStaticModules: [require.resolve('./src/constants.ts')],
    },
  }
}
