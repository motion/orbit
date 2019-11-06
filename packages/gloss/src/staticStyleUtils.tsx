import { addRules, compileThemes, getSortedNamespaces, getStylesFromThemeFns, GlossView, mergeStyles } from './gloss'
import { CompiledTheme } from './theme/createTheme'
import { createThemeProxy } from './theme/createThemeProxy'
import { ThemeTrackState } from './theme/useTheme'

/**
 * START external static style block (TODO move out to own thing)
 *
 * keeping it here for now because dont want to add more fns in sensitive loops above
 * this is a really hacky area right now as im just trying to figure out the right way
 * to do all of this, once it settles into something working we can set up some tests,
 * some performance checks, and then hopefully dedupe this code with the code above +
 * split it out and make it all a lot more clearly named/structured.
 */

 export type StaticStyleDesc = {
  css: string
  className: string
  ns: string
}

function getAllStyles(props: any, _depth = 0, ns = '.') {
  if (!props) {
    return []
  }
  const allStyles = { [ns]: {} }
  mergeStyles(ns, allStyles, props)
  const styles: StaticStyleDesc[] = []
  const namespaces = getSortedNamespaces(allStyles)
  for (const ns of namespaces) {
    const styleObj = allStyles[ns]
    if (!styleObj)
      continue
    const info = addRules('', styleObj, ns, false)
    if (info) {
      // @ts-ignore
      styles.push({ ns, ...info, })
    }
  }
  return styles
}

/**
 * For use externally only (static style extract)
 */
function getStyles(props: any, depth = 0, ns = '.') {
  return getAllStyles(props, depth, ns)[0] ?? null
}

/**
 * For use externally only (static style extract)
 * see addDynamicStyles equivalent
 */
export type ThemeStyleInfo = {
  trackState: ThemeTrackState | null
  themeStyles: StaticStyleDesc[] | null
}

function getThemeStyles(view: GlossView, userTheme: CompiledTheme, props: any, _extraDepth = 0): ThemeStyleInfo {
  const themeFns = compileThemes(view)
  if (!themeFns) {
    return {
      themeStyles: null,
      trackState: null,
    }
  }
  const trackState: ThemeTrackState = {
    theme: userTheme,
    hasUsedOnlyCSSVariables: true,
    nonCSSVariables: new Set(),
    usedProps: new Set()
  }
  // themes always one above, extraDepth if theres a local view
  // const depth = view.internal.depth + extraDepth
  const themeStyles: StaticStyleDesc[] = []
  const len = themeFns.length - 1
  const theme = createThemeProxy(userTheme, trackState, props)
  for (const [index, themeFnList] of themeFns.entries()) {
    // const themeDepth = depth - (len - index)
    const styles = getStylesFromThemeFns(themeFnList, theme)
    if (Object.keys(styles).length) {
      // make an object for each level of theme
      const curThemeObj = { ['.']: {} }
      mergeStyles('.', curThemeObj, styles, true)
      const namespaces = getSortedNamespaces(curThemeObj)
      for (const ns of namespaces) {
        const styleObj = curThemeObj[ns]
        if (!styleObj)
          continue
        const info = addRules('', styleObj, ns, false)
        if (info) {
          // @ts-ignore
          themeStyles.push({ ns, ...info, })
        }
      }
    }
  }
  return { themeStyles, trackState }
}

export const StaticUtils = { getAllStyles, getStyles, getThemeStyles }
