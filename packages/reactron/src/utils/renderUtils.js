export function validateElement(element) {
  if (!element) {
    throw new Error('Render method expected an element.')
  }

  if (typeof element === 'string') {
    throw new Error(
      'Invalid component element. Instead of passing string like \'text\', pass a class or functional component. For example - <Document />'
    )
  }

  return true
}
