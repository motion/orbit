// @flow
export default function cleanId(doc: Object) {
  return `${doc.integration}-${doc.type}-${doc.id.replace(/[^A-Za-z0-9]/, '')}`
}
