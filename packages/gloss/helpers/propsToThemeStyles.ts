const themeStates = {
  hover: '&:hover',
  focus: '&:focus',
  active: '&:active',
}

const themeOverrides = {
  active: 'activeStyle',
  hover: 'hoverStyle',
  focus: 'focusStyle',
}

// resolves props into styles for valid css
// backs up to theme colors if not found

export const propsToThemeStyles = (props, mapPropStylesToPseudos?) => {
  let styles = {
    ...props.theme.base,
  }
  for (const state in themeStates) {
    const pseudoKey = themeStates[state]
    styles[pseudoKey] = {
      ...styles[pseudoKey],
      ...props.theme[state],
    }
    const overrideStyles = props[themeOverrides[state]]
    if (mapPropStylesToPseudos && overrideStyles) {
      styles[pseudoKey] = {
        ...styles[pseudoKey],
        ...overrideStyles,
      }
    }
  }
  return styles
}
