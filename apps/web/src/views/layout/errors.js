import React from 'react'
import { view } from '@mcro/black'
import { App } from '~/index'

@view
export default class Errors {
  render() {
    if (!App) {
      return null
    }

    const errs = App.errors.filter(
      x => x.message !== 'Document update conflict'
    )

    return (
      <errors>
        {errs.map((error, i) => (
          <error key={error.id || Math.random()}>
            <message $$ellipse if={error.errors}>
              {error.errors.map(({ field, message }) => (
                <subErr key={Math.random()}>
                  {field ? `${field}:` : ''} {message}
                </subErr>
              ))}
            </message>
            <message $$ellipse if={error.message && !error.errors}>
              <strong if={error.name}>{error.name}:</strong> {error.message}
            </message>
            <message $$ellipse if={error.reason && !error.message}>
              <strong if={error.reason.name}>{error.reason.name}:</strong>{' '}
              {error.reason.message}
            </message>
            <clear if={i === 0} onClick={App.clearErrors}>
              x
            </clear>
          </error>
        ))}
      </errors>
    )
  }

  static style = {
    errors: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 100000,
      pointerEvents: 'none',
      userSelect: 'none',
    },
    error: {
      fontSize: 15,
      fontWeight: 500,
      padding: [7, 10],
      color: 'red',
      background: '#f6dada',
      boxShadow: [0, 0, 20, [0, 0, 0, 0.1]],
      flexFlow: 'row',
      justifyContent: 'space-between',
      pointerEvents: 'auto',
      userSelect: 'auto',
      alignItems: 'center',
    },
    message: {
      flexFlow: 'row',
      flex: 1,
    },
    clear: {
      cursor: 'pointer',
      fontSize: 14,
      fontWeight: 600,
    },
  }
}
