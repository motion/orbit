import { makeStyleTag } from './makeStyleTag'

export class StyleSheet {
  disabled = false
  injected = false

  constructor(private isSpeedy: boolean = true) {
    this.flush()
    this.inject()
  }

  ruleIndexes: string[] = []
  tag: HTMLStyleElement | null = null

  getRuleCount(): number {
    return this.ruleIndexes.length
  }

  flush() {
    this.ruleIndexes = []
    if (this.tag) {
      this.tag.innerHTML = ''
    }
  }

  inject() {
    if (this.injected) {
      throw new Error('already injected stylesheet!')
    }
    this.tag = makeStyleTag()
    this.injected = true
  }

  delete(key: string) {
    const index = this.ruleIndexes.indexOf(key)
    if (index < 0) {
      // TODO maybe error
      return
    }
    this.ruleIndexes.splice(index, 1)
    const tag = this.tag
    if (!tag) {
      return
    }
    if (this.isSpeedy) {
      const sheet = tag.sheet as CSSStyleSheet
      sheet.deleteRule(index)
    } else {
      tag.removeChild(tag.childNodes[index + 1])
    }
  }

  insert(key: string, rule: string) {
    const tag = this.tag
    if (!tag) {
      return
    }
    if (this.isSpeedy) {
      const sheet = tag.sheet as CSSStyleSheet
      sheet.insertRule(rule, sheet.cssRules.length)
    } else {
      tag.appendChild(document.createTextNode(rule))
    }

    this.ruleIndexes.push(key)
  }
}
