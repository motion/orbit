const webkitPrefix = 'Webkit'
const propertiesToPrefix = {
  transform: true,
  transformOrigin: true,
  transition: true,
}

export default function prefix(styles) {
  const prefixedStyles = {}
  const styleProperties = Object.keys(styles || {})
  styleProperties.forEach(property => {
    if (propertiesToPrefix[property]) {
      const prefixedProperty =
        webkitPrefix + property[0].toUpperCase() + property.slice(1)
      prefixedStyles[prefixedProperty] = styles[property]
    }
    prefixedStyles[property] = styles[property]
  })
  return prefixedStyles
}
