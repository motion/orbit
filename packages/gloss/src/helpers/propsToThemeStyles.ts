import { ThemeObject } from '@mcro/css'
import { styleVal } from './propsToStyles'

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
  props: any,
  theme: ThemeObject,
  mapPropStylesToPseudos?: boolean,
): ThemeStyles => {
  let styles = {
    color: props.color || theme.color,
    background: props.background || theme.background,
    borderColor: props.borderColor || theme.borderColor,
  }
  // if we set styles from props we should propogate those styles
  // down to be sure we don't "undo" them inside pseudo styles
  let propOverrides
  if (props.background || props.borderColor || props.color) {
    propOverrides = {}
    if (props.background) {
      propOverrides.background = styleVal(props.background, theme)
    }
    if (props.color) {
      propOverrides.color = styleVal(props.color, theme)
    }
    if (props.borderColor) {
      propOverrides.borderColor = styleVal(props.borderColor, theme)
    }
  }

  let stylesFromProps
  for (const themeKey in config) {
    const { postfix, pseudoKey, booleanProp, extraStyleProp } = config[themeKey]
    const booleanOn = typeof booleanProp !== 'undefined' && props[booleanProp] === true
    if (props[booleanProp] === false) {
      continue
    }
    let pseudoStyle = pseudoKey || booleanOn ? collectStylesForPseudo(theme, postfix) : null
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
        ...propOverrides,
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
  // if (props.debug) {
  //   debugger
  // }
  return {
    themeStyles: styles as ThemeObjectWithPseudo,
    themeStylesFromProps: stylesFromProps,
  }
}
