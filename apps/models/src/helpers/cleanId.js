// @flow
export default function cleanId(id: string) {
  return id.replace(/[^A-Za-z0-9]/, '')
}
