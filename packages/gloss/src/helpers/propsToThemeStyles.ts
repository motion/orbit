import { ThemeObject } from '@mcro/css'
import { styleVal } from './propsToStyles'

// resolves props into styles for valid css
// backs up to theme colors if not found

const collectStylesForPseudo = (theme, postfix) => {
  return {
    background: theme[`background${postfix}`],
    color: theme[`color${postfix}`],
    borderColor: theme[`borderColor${postfix}`],
  }
}

type ThemeObjectWithPseudo = ThemeObject & {
  '&:hover'?: ThemeObject
  '&:focus'?: ThemeObject
  '&:active'?: ThemeObject
}

const pseudoConfig = {
  hover: {
    pseudoKey: '&:hover',
    postfix: 'Hover',
    forceOnProp: 'hover',
    extraStyleProp: 'hoverStyle',
  },
  focus: {
    pseudoKey: '&:focus',
    postfix: 'Focus',
    forceOnProp: 'focus',
    extraStyleProp: 'focusStyle',
  },
  active: {
    pseudoKey: '&:active',
    postfix: 'Active',
    forceOnProp: 'active',
    extraStyleProp: 'activeStyle',
  },
}

export const propsToThemeStyles = (
  props: any,
  theme: ThemeObject,
  mapPropStylesToPseudos?: boolean,
): ThemeObjectWithPseudo => {
  if (!theme) {
    throw new Error('No theme passed to propsToThemeStyles')
  }
  let styles: ThemeObjectWithPseudo = {
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

  for (const key in pseudoConfig) {
    const { postfix, pseudoKey, forceOnProp, extraStyleProp } = pseudoConfig[key]
    // forced on
    const forcedOn = forceOnProp && props[forceOnProp] === true
    // forced off
    if (props[forceOnProp] === false) {
      continue
    }
    let pseudoStyle = pseudoKey || forcedOn ? collectStylesForPseudo(theme, postfix) : null
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
  }

  return styles
}
