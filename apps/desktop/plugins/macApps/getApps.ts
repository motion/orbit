import mdfind from './find'

const supportedTypes = [
  'com.apple.application-bundle',
  'com.apple.systempreference.prefpane',
]

const buildQuery = () =>
  supportedTypes.map(type => `kMDItemContentType=${type}`).join('||')

let cancelPrevious = () => {}

export default () => {
  cancelPrevious()
  return new Promise(resolve => {
    const { output, terminate } = mdfind({
      query: buildQuery(),
      limit: 200,
    })
    cancelPrevious = terminate
    const result = []
    output.on('data', file => result.push(file))
    output.on('end', () => resolve(result))
  })
}
