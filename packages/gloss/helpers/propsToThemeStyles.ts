const themeStates = {
  hover: '&:hover',
  focus: '&:focus',
  active: '&:active',
}

// resolves props into styles for valid css
// backs up to theme colors if not found

export const propsToThemeStyles = props => {
  const styles = {
    ...props.theme.base,
  }
  for (const state in themeStates) {
    styles[themeStates[state]] = {
      ...props.theme[state],
      ...(props[state] instanceof Object ? props[state] : null),
    }
  }
  return styles
}
