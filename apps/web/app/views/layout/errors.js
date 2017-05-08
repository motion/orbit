import { view } from '~/helpers'
import App from 'models'
import { SIDEBAR_WIDTH } from '~/constants'

@view
export default class Errors {
  render() {
    const errs = App.errors.filter(
      x => x.message !== 'Document update conflict'
    )

    return (
      <errors>
        {errs.map((error, i) => (
          <error key={error.id || Math.random()}>
            <message if={error.errors}>
              {error.errors.map(({ field, message }) => (
                <subErr key={Math.random()}>{field}: {message}</subErr>
              ))}
            </message>
            <message if={error.message}>
              <strong>{error.name}</strong>: {error.message}
            </message>
            <clear if={i === 0} onClick={App.clearErrors}>x</clear>
          </error>
        ))}
      </errors>
    )
  }

  static style = {
    errors: {
      position: 'fixed',
      right: SIDEBAR_WIDTH,
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
