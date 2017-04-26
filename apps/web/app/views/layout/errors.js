import { view } from '~/helpers'
import App from 'models'

@view
export default class Errors {
  render() {
    return (
      <errors>
        {App.errors.map((error, i) => (
          <error key={error.id}>
            <message>
              {error.errors.map(({ field, message }) => (
                <subErr key={Math.random()}>{field}: {message}</subErr>
              ))}
            </message>
            <clear if={i === 0} onClick={App.clearErrors}>x</clear>
          </error>
        ))}
      </errors>
    )
  }

  static style = {
    errors: {
      position: 'absolute',
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: 100000,
      pointerEvents: 'none',
      userSelect: 'none',
    },
    error: {
      padding: 10,
      background: 'red',
      color: '#fff',
      flexFlow: 'row',
      justifyContent: 'space-between',
      pointerEvents: 'auto',
      userSelect: 'auto',
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
