import { ThemeObject } from '@o/css'
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

const stateConfig = {
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
  stylePseudos?: boolean,
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
      propOverrides.background = styleVal(props.background, theme, props)
    }
    if (props.color) {
      propOverrides.color = styleVal(props.color, theme, props)
    }
    if (props.borderColor) {
      propOverrides.borderColor = styleVal(props.borderColor, theme, props)
    }
  }

  for (const key in stateConfig) {
    const { postfix, pseudoKey, forceOnProp, extraStyleProp } = stateConfig[key]
    if (props[forceOnProp] === false) continue // forced off
    if (props[extraStyleProp] === null) continue // forced empty

    let stateStyle = collectStylesForPseudo(theme, postfix)

    // add in any overrideStyles
    if (typeof props[extraStyleProp] === 'object') {
      Object.assign(stateStyle, props[extraStyleProp])
    }

    if (propOverrides) {
      Object.assign(stateStyle, propOverrides)
    }

    if (stylePseudos) {
      styles[pseudoKey] = stateStyle
    }

    const booleanOn = forceOnProp && props[forceOnProp] === true
    if (booleanOn) {
      Object.assign(styles, stateStyle)
    }
  }

  return styles
}
