import { CompiledTheme, GlossView } from 'gloss'

export interface CacheObject {
  [key: string]: any
}

export interface ExtractStylesOptions {
  views: {
    [key: string]: GlossView
  }
  mediaQueryKeys?: string[]
  internalViewsPaths?: string[]
  deoptKeys?: string[]
  defaultTheme: CompiledTheme
  ignore?: RegExp
  babelOptions?: { presets: Object; plugins: Object }
  whitelistStaticModules?: string[]
}

export interface LoaderOptions extends ExtractStylesOptions {
  cacheFile?: string
}

export interface PluginContext {
  cacheFile: string | null
  cacheObject: CacheObject
  memoryFS: any
  fileList: Set<string>
}
