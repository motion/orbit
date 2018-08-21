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

const collectStylesForPseudo = (theme, postfix) => {
  return {
    background: theme[`background${postfix}`],
    color: theme[`color${postfix}`],
    borderColor: theme[`borderColor${postfix}`],
  }
}

type ThemeObjectWithPseudo = ThemeObject & {
  '&:hover': ThemeObject
  '&:focus': ThemeObject
  '&:active': ThemeObject
}

type ThemeStyles = {
  themeStyles: ThemeObjectWithPseudo
  themeStylesFromProps?: Partial<ThemeObject>
}

export const propsToThemeStyles = (
  props,
  mapPropStylesToPseudos?: boolean,
): ThemeStyles => {
  const theme = props.theme
  let styles = {
    color: theme.color,
    background: theme.background,
    borderColor: theme.borderColor,
  }
  // if we set styles from props we should propogate those styles
  // down to be sure we don't "undo" them inside pseudo styles
  let baseStylesFromProps
  if (props.background || props.borderColor || props.color) {
    baseStylesFromProps = {}
    if (props.background) {
      baseStylesFromProps.background = props.background
    }
    if (props.color) {
      baseStylesFromProps.color = props.color
    }
    if (props.borderColor) {
      baseStylesFromProps.borderColor = props.borderColor
    }
  }

  let stylesFromProps
  for (const themeKey in config) {
    const { postfix, pseudoKey, booleanProp, extraStyleProp } = config[themeKey]
    const booleanOn = booleanProp && props[booleanProp] === true
    let pseudoStyle =
      pseudoKey || booleanOn ? collectStylesForPseudo(theme, postfix) : null
    // add in any overrideStyles
    if (mapPropStylesToPseudos && typeof props[extraStyleProp] === 'object') {
      pseudoStyle = {
        ...pseudoStyle,
        ...props[extraStyleProp],
      }
    }
    // merge now into the psuedo state
    if (pseudoKey) {
      styles[pseudoKey] = {
        ...styles[pseudoKey],
        ...pseudoStyle,
        // propogate overrides on the base style props like <Surface background="transparent" />
        ...baseStylesFromProps,
      }
    }
    // merge into base stlyes if booleans force it on
    if (booleanOn) {
      stylesFromProps = stylesFromProps || {}
      stylesFromProps = {
        ...stylesFromProps,
        ...pseudoStyle,
      }
    }
  }
  return {
    themeStyles: styles as ThemeObjectWithPseudo,
    themeStylesFromProps: stylesFromProps,
  }
}
