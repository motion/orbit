import fileIcon from 'file-icon'

export default async function getIcon(path, opts = { size: 64 }) {
  const icon = await fileIcon.buffer(path, opts)
  return `data:image/png;base64,${icon.toString('base64')}`
}
