import { CSSPropertySet, GlossBaseProps } from '@o/gloss'
import { CommonViewProps } from './CommonViewProps'
import { CommonHTMLProps } from './View'

// these are used to filter out all the "excess" props for docs generation
export type BaseViewProps = CommonHTMLProps & GlossBaseProps & CommonViewProps

export const BaseViewProps = (props: BaseViewProps) => props.children
export const BaseCSSProps = (props: CSSPropertySet) => props.children
