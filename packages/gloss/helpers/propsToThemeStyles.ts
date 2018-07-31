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

export const propsToThemeStyles = (props, mapPsuedoToBooleans?) => {
  let styles = {
    ...props.theme.base,
  }
  for (const state in themeStates) {
    styles[themeStates[state]] = props.theme[state]
    const overrideStyles = props[themeOverrides[state]]
    if (mapPsuedoToBooleans && overrideStyles) {
      if (props[state]) {
        styles = {
          ...styles,
          ...overrideStyles,
        }
      }
    }
  }
  return styles
}
