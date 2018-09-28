import Typography from 'typography'
import Theme from 'typography-theme-wordpress-2016'

Theme.overrideThemeStyles = () => ({
  'a.gatsby-resp-image-link': {
    boxShadow: 'none',
  },
})

delete Theme.googleFonts

Theme.headerFontFamily = [
  'system-ui',
  'BlinkMacSystemFont',
  'Helvetica Neue',
  'Helvetica',
  'sans-serif',
]
Theme.bodyFontFamily = [
  'system-ui',
  'BlinkMacSystemFont',
  'Helvetica Neue',
  'Helvetica',
  'sans-serif',
]

const typography = new Typography(Theme)

// Hot reload typography in development.
if (process.env.NODE_ENV !== 'production') {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
