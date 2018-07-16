import execa from 'execa'

export async function clean() {
  console.log('cleaning node_modules/.cache...')
  try {
    await execa('rm', ['-r', 'node_modules/.cache'])
  } catch (err) {
    console.log('err', err)
  }
  console.log('cleaning .cache-loader...')
  try {
    await execa('rm', ['-r', '.cache-loader'])
  } catch (err) {
    console.log('err', err)
  }
}
