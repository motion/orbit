import execa from 'execa'

export async function clean() {
  await execa('rm', ['-r', 'node_modules/.cache'])
}
