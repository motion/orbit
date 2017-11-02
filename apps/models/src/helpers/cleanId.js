// @flow
export default function cleanId(doc: Object) {
  // avoid double
  if (!doc.id) {
    doc.id = `${Math.random()}`.replace('.', '')
  }
  if (doc.id.indexOf(doc.integration) === 0) {
    return doc.id
  }
  return `${doc.integration}-${doc.type}-${doc.id.replace(/[^A-Za-z0-9]/, '')}`
}
