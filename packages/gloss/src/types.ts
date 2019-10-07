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
// Names of properties in T with types that include undefined
type OptionalPropertyNames<T> = { [K in keyof T]: undefined extends T[K] ? K : never }[keyof T]

// Common properties from L and R with undefined in R[K] replaced by type in L[K]
type SpreadProperties<L, R, K extends keyof L & keyof R> = {
  [P in K]: L[P] | Exclude<R[P], undefined>
}

type Id<T> = { [K in keyof T]: T[K] } // see note at bottom*

// Type of { ...L, ...R }
export type Spread<L, R> = Id<
  // Properties in L that don't exist in R
  Pick<L, Exclude<keyof L, keyof R>> &
    // Properties in R with types that exclude undefined
    Pick<R, Exclude<keyof R, OptionalPropertyNames<R>>> &
    // Properties in R, with types that include undefined, that don't exist in L
    Pick<R, Exclude<OptionalPropertyNames<R>, keyof L>> &
    // Properties in R, with types that include undefined, that exist in L
    SpreadProperties<L, R, OptionalPropertyNames<R> & keyof L>
>
