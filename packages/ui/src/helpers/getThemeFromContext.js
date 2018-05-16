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
      }
      // no found theme, try making custom
      if (this.props[themePropName]) {
        const theme = Theme.fromColor(this.props[themePropName])
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
    } else {
      return this.context
    }
  }
}
