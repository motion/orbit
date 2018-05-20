import ThemeMaker from './themeMaker'

const Theme = new ThemeMaker()

export default function getThemeFromContext(
  propName = 'name',
  themePropName = 'theme',
) {
  return function getContext() {
    const prop = this.props[propName]
    if (prop) {
      if (this.context.uiThemes[prop]) {
        return {
          uiActiveThemeName: prop,
          uiActiveTheme: this.context.uiThemes[prop],
        }
      } else {
        console.error(
          'this is',
          this,
          'got theme prop',
          prop,
          'whats in context',
          this.context.uiThemes,
        )
        throw new Error(`Didnt find theme for this prop ${propName}`)
      }
    }
    // no found theme, try making custom
    const themeProp = this.props[themePropName]
    if (themeProp) {
      const theme =
        typeof themeProp === 'string'
          ? Theme.fromColor(themeProp)
          : Theme.fromStyles(themeProp)
      if (theme) {
        return {
          uiThemes: {
            ...this.context.uiThemes,
            [prop]: theme,
          },
          uiActiveThemeName: prop,
          uiActiveTheme: theme,
        }
      }
    }
    return this.context
  }
}
