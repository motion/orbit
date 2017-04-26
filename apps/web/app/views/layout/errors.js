import { view } from '~/helpers'
import App from 'models'

@view
export default class Errors {
  render() {
    return (
      <errors>
        {App.errors.map(error => (
          <error key={error.id}>
            <message>
              {error.errors.map(({ field, message }) => (
                <subErr>{field}: {message}</subErr>
              ))}
            </message>
            <clear onClick={App.clearErrors}>x</clear>
          </error>
        ))}
      </errors>
    )
  }

  static style = {
    errors: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: 100000,
    },
    error: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 10,
      background: 'red',
      color: '#fff',
      flexFlow: 'row',
      justifyContent: 'space-between',
    },
    message: {
      flexFlow: 'row',
    },
    clear: {
      cursor: 'pointer',
      fontSize: 26,
      fontWeight: 600,
    },
  }
}
