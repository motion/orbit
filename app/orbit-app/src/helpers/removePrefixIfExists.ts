export function removePrefixIfExists(text: string, prefix: string) {
  if (text[0] === prefix) {
    return text.slice(1)
  }
  return text
}
