export type Psuedos = '&:hover' | '&:active' | '&:focus' | '&:disabled'

export type GlossConfig = {
  toColor: Function
  isColor: Function
  pseudoAbbreviations?: { [key: string]: Psuedos }
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
export interface BaseTheme {}
export type ITheme<A> = A

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

export type BabelState = {
  opts: {
    matchNames: string[]
    matchImports: string[]
  }
  rules: {
    [selector: string]: {
      className: string
      displayName: string
      cssText: string
      start?: Location
    }
  }
  replacements: {
    original: { start: Location; end: Location }
    length: number
  }[]
  index: number
  dependencies: string[]
  file: {
    opts: {
      cwd: string
      root: string
      filename: string
    }
    metadata: any
  }
}
