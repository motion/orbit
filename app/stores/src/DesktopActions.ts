import { Desktop } from './Desktop'

export const error = {
  setError(errorState: typeof Desktop.state.errorState) {
    console.error('Got a user error', errorState)
    Desktop.setState({ errorState })
  },
  clearError() {
    console.log('Clearing error')
    Desktop.setState({
      errorState: {
        title: '',
        message: '',
        type: 'null',
      },
    })
  },
}
