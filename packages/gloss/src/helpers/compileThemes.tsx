import { GlossView, ThemeFn } from '../gloss'

// compile theme from parents
export function compileThemes(viewOG: GlossView) {
  let cur = viewOG
  const hasOwnTheme = cur.internal.themeFns

  // this is a list of a list of theme functions
  // we run theme functions from parents before, working down to ours
  // the parent ones have a lower priority, so we want them first
  const added = new Set()
  let all: ThemeFn[][] = []
  const hoisted: ThemeFn[] = []

  // get themes in order from most important (current) to least important (grandparent)
  while (cur) {
    const conf = cur.internal
    if (conf.themeFns) {
      let curThemes: ThemeFn[] = []
      for (const fn of conf.themeFns) {
        if (added.has(fn)) {
          continue // prevent duplicates in parents
        }
        added.add(fn)
        if (fn.hoistTheme) {
          hoisted.push(fn)
        } else {
          curThemes.push(fn)
        }
      }
      if (curThemes.length) {
        all.push(curThemes)
      }
    }
    cur = conf.parent
  }

  if (!hasOwnTheme) {
    all.unshift([])
  }

  // hoisted always go onto starting of the cur theme
  if (hoisted.length) {
    all[0] = [...hoisted, ...(all[0] || [])]
  }

  const themes = all.filter(Boolean)
  if (!themes.length) {
    return null
  }

  return themes
}
