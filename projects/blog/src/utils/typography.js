import Typography from 'typography'
import Theme from 'typography-theme-wordpress-2016'
import './styles.css'

Theme.overrideThemeStyles = () => ({
  'a.gatsby-resp-image-link': {
    boxShadow: 'none',
  },
})

delete Theme.googleFonts

// @ts-ignore
const typography = new Typography({
  ...Theme,
  headerFontFamily: [
    'system-ui',
    'BlinkMacSystemFont',
    'Helvetica Neue',
    'Helvetica',
    'sans-serif',
  ],
  bodyFontFamily: ['system-ui', 'BlinkMacSystemFont', 'Helvetica Neue', 'Helvetica', 'sans-serif'],
})

// Hot reload typography in development.
if (process.env.NODE_ENV !== 'production') {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
