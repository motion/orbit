// resolves props into styles for valid css
// backs up to theme colors if not found

const themeStates = {
  Hover: '&:hover',
  Focus: '&:focus',
  Active: '&:active',
}

const themeOverrides = {
  active: 'activeStyle',
  hover: 'hoverStyle',
  focus: 'focusStyle',
}

const collectStylesForPsuedo = (theme, postfix) => {
  const keys = Object.keys(theme).filter(
    x => x.indexOf(postfix) === x.length - 1,
  )
  if (!keys.length) {
    return null
  }
  let styles = {}
  for (const key of keys) {
    styles[key] = theme[key]
  }
  return styles
}

export const propsToThemeStyles = (props, mapPropStylesToPseudos?) => {
  const theme = props.theme
  let styles = {
    color: theme.color,
    background: theme.background,
    borderColor: theme.borderColor,
  }
  for (const postfix in themeStates) {
    const key = themeStates[postfix]
    const psuedoStyles = collectStylesForPsuedo(theme, postfix)
    styles[key] = {
      ...styles[key],
      ...psuedoStyles,
    }
    if (mapPropStylesToPseudos) {
      const overrideStyles = props[themeOverrides[postfix.toLowerCase()]]
      if (overrideStyles) {
        styles[key] = {
          ...styles[key],
          ...overrideStyles,
        }
      }
    }
  }
  return styles
}
