import { ThemeObject } from '../types'

// resolves props into styles for valid css
// backs up to theme colors if not found

const config = {
  hover: {
    pseudoKey: '&:hover',
    postfix: 'Hover',
    booleanProp: 'hover',
    extraStyleProp: 'hoverStyle',
  },
  focus: {
    pseudoKey: '&:focus',
    postfix: 'Focus',
    booleanProp: 'focus',
    extraStyleProp: 'focusStyle',
  },
  active: {
    pseudoKey: '&:active',
    postfix: 'Active',
    booleanProp: 'active',
    extraStyleProp: 'activeStyle',
  },
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

type ThemeObjectWithPsuedos = ThemeObject & {
  '&:hover': ThemeObject
  '&:focus': ThemeObject
  '&:active': ThemeObject
}

type ThemeStyles = {
  themeStyles: ThemeObjectWithPsuedos
  themeStylesFromProps: Partial<ThemeObject>
}

export const propsToThemeStyles = (
  props,
  mapPropStylesToPseudos?,
): ThemeStyles => {
  const theme = props.theme
  let styles = {
    color: theme.color,
    background: theme.background,
    borderColor: theme.borderColor,
  }
  let stylesFromProps = {}
  for (const themeKey in config) {
    const { postfix, psuedoKey, booleanProp, extraStyleProp } = config[themeKey]
    const booleanOn = booleanProp && props[booleanProp] === true
    let psuedoStyle =
      psuedoKey || booleanOn ? collectStylesForPsuedo(theme, postfix) : null
    // add in any overrideStyles
    if (mapPropStylesToPseudos && typeof props[extraStyleProp] === 'object') {
      psuedoStyle = {
        ...psuedoStyle,
        ...props[extraStyleProp],
      }
    }
    // merge now into the psuedo state
    if (psuedoKey) {
      styles[psuedoKey] = {
        ...styles[psuedoKey],
        ...psuedoStyle,
      }
    }
    // merge into base stlyes if booleans force it on
    if (booleanOn) {
      stylesFromProps = {
        ...stylesFromProps,
        ...psuedoStyle,
      }
    }
  }
  return {
    themeStyles: styles as ThemeObjectWithPsuedos,
    themeStylesFromProps: stylesFromProps
  }
}
