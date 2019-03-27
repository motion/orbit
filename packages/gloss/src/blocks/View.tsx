import { CSSPropertySetStrict, validCSSAttr } from '@o/css'
import { gloss } from '../gloss'
import { propsToStyles } from '../helpers/propsToStyles'
import { propsToTextSize } from '../helpers/propsToTextSize'

export type ViewProps = React.HTMLAttributes<HTMLDivElement> &
  CSSPropertySetStrict & {
    // our default styling supports is through preProcessTheme
    alt?: string
    // our default styling supports pseudos through propsToStyles
    hoverStyle?: CSSPropertySetStrict
    activeStyle?: CSSPropertySetStrict
    focusStyle?: CSSPropertySetStrict
  }

export const View = gloss<ViewProps>().theme((props, theme) => ({
  ...propsToStyles(props, theme),
  ...propsToTextSize(props),
}))

// ignore all valid css props, except src for images
View.ignoreAttrs = {
  ...validCSSAttr,
  size: true,
  src: false,
}
