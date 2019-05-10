import { CommonHTMLProps, CSSPropertySet } from 'gloss'

import { CommonViewProps } from './CommonViewProps'

// these are used to filter out all the "excess" props for docs generation
export type BaseViewProps = CommonHTMLProps & CommonViewProps

export const BaseViewProps = (props: BaseViewProps) => props.children
export const BaseCSSProps = (props: CSSPropertySet) => props.children
