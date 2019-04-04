import { CSSPropertySetStrict, validCSSAttr } from '@o/css'
import { gloss } from '../gloss'
import { propsToStyles } from '../helpers/propsToStyles'
import { propsToTextSize } from '../helpers/propsToTextSize'

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export type BaseProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> &
  CSSPropertySetStrict & {
    tagName?: string
    // our default styling supports is through preProcessTheme
    alt?: string
    // our default styling supports pseudos through propsToStyles
    hoverStyle?: CSSPropertySetStrict
    activeStyle?: CSSPropertySetStrict
    focusStyle?: CSSPropertySetStrict
  }

export const Base = gloss<BaseProps>().theme((props, theme) => ({
  ...propsToStyles(props, theme),
  ...propsToTextSize(props),
}))

// ignore all valid css props, except src for images
Base.ignoreAttrs = {
  ...validCSSAttr,
  size: true,
  src: false,
}
