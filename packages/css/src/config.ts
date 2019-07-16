export type CSSOptions = {
  toColor: (a: any) => string
  isColor: (a: any) => boolean
}

export let Config: CSSOptions = {
  isColor: _ => _ && !!_.toString,
  toColor: _ => _.toString(),
}

export function configureCSS(options: Partial<CSSOptions>) {
  Object.assign(Config, options)
  Object.freeze(Config) // only allow once
}

if (typeof module !== 'undefined' && module.hot) {
  module.hot.accept(() => {
    if (module.hot) {
      Config = module.hot.data || Config
    }
  })
  module.hot.dispose(_ => {
    _.data = Config
  })
}
