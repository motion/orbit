type AppProps = {
  index?: React.ReactNode
  children?: React.ReactNode
}

const appViews = ['index', 'children']

export function App(props: AppProps) {
  for (const key in props) {
    if (!appViews[key]) {
      throw new Error(`Invalid prop passed ${key}`)
    }
  }

  return null
}
