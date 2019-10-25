import { Color } from '@o/color'
import { CSSPropertySet, CSSPropertySetStrict, GlossPropertySet } from '@o/css'

import { ThemeSelect } from './theme/Theme'
import { ThemeValue } from './theme/ThemeValue'

export type Psuedos = '&:hover' | '&:active' | '&:focus' | '&:focus-within' | '&:disabled'

export type GlossConfiguration = {
  toColor: Function
  isColor: Function
  mediaQueries?: null | {
    [key: string]: string
  }
}

// helpful for themes

export type NoS = number | string
export type ColorArray = NoS[]
export type ColorObject = { r: NoS; g: NoS; b: NoS; a?: NoS }
export type ColorClassLike = { getCSSValue: Function } | { css: Function } | { alpha: Function }
export type ColorLike = string | ColorClassLike | ColorArray | ColorObject

// overridable theme
export interface ThemeType {}
export type CreateThemeType<A> = {
  [K in keyof A]: A[K] extends { cssVariable: any } ? A[K] : ThemeValue<any>
}

// TODO whitelist instead
// basic desire is to not overlap with CSS props
// + move more towards react-native-web like props
export type CommonHTMLProps = Omit<
  React.HTMLAttributes<HTMLElement>,
  | 'title'
  | 'about'
  | 'accessKey'
  | 'autoCapitalize'
  | 'autoCorrect'
  | 'autoSave'
  | 'vocab'
  | 'typeof'
  | 'suppressHydrationWarning'
  | 'suppressContentEditableWarning'
  | 'spellCheck'
  | 'security'
  | 'slot'
  | 'results'
  | 'resource'
  | 'prefix'
  | 'property'
  | 'radioGroup'
  | 'contextMenu'
  | 'dir'
  | 'datatype'
  | 'inlist'
  | 'itemID'
  | 'lang'
  | 'is'
  | 'itemScope'
  | 'inputMode'
  | 'color'
  | 'size'
>

export type GlossBaseProps<Props = {}> = {
  tagName?: string
  nodeRef?: any
  coat?: string | false
  subTheme?: ThemeSelect
  conditional?: {
    [key: string]: CSSPropertySet
  }
  config?: GlossViewConfig<
    Props & {
      // a little duplication with above ^
      tagName?: string
      nodeRef?: any
      coat?: string | false
      subTheme?: ThemeSelect
    }
  >
}

export type GlossViewConfig<Props = {}> = {
  displayName?: string
  ignoreAttrs?: { [key: string]: boolean }
  shouldAvoidProcessingStyles?: (props: Props) => boolean
  postProcessProps?: (curProps: Props, nextProps: any, getFinalStyles: () => CSSPropertySet) => any
  getElement?: (props: Props) => any
  isDOMElement?: boolean
}

// theme types
export type GenerateGlossProps<Props, CSSProps> = Omit<CommonHTMLProps, keyof Props> &
  Omit<CSSProps, keyof Props> &
  Omit<Props, keyof GlossBaseProps<Props>> &
  GlossBaseProps<Props>

export type GlossProps<Props = {}> = GenerateGlossProps<Props, CSSPropertySetStrict> & {
  [key: string]: GlossPropertySet | any
}

export type GlossPropsPartial<Props = {}> = Partial<
  GenerateGlossProps<Props, CSSPropertySetStrict>
> & {
  [key: string]: GlossPropertySet | any
}

type ColorKeys = 'background' | 'backgroundColor' | 'color' | 'borderColor'

// compiles themeprops from regular props
export type GlossThemeProps<
  Props = {},
  FinalProps = Omit<GenerateGlossProps<Partial<Props>, GlossPropertySet>, ColorKeys>
> = ThemeType &
  FinalProps & {
    name: string
  } & {
    [K in ColorKeys & Exclude<string, keyof FinalProps>]:
      | (K extends ColorKeys ? Color : ThemeValue<any>)
      | undefined
  }

export type SimpleStyleObject = {
  color?: ColorLike
  background?: ColorLike
  borderColor?: ColorLike
  [a: string]: ColorLike | ColorObject | any
}

export type StrictOptions = {
  displayName: boolean
  evaluate: boolean
  ignore: RegExp
  babelOptions: Object
}
