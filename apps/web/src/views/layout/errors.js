import React from 'react'
import { view } from '@jot/black'
import App from '~/app'
import { SIDEBAR_WIDTH } from '~/constants'

@view
export default class Errors {
  render() {
    const errs = App.errors.filter(
      x => x.message !== 'Document update conflict'
    )

    return (
      <errors>
        {errs.map((error, i) =>
          <error key={error.id || Math.random()}>
            <message $$ellipse if={error.errors}>
              {error.errors.map(({ field, message }) =>
                <subErr key={Math.random()}>{field}: {message}</subErr>
              )}
            </message>
            <message $$ellipse if={error.message}>
              <strong>{error.name}</strong>: {error.message}
            </message>
            <message $$ellipse if={error.reason}>
              <strong>{error.reason.name}</strong>: {error.reason.message}
            </message>
            <clear if={i === 0} onClick={App.clearErrors}>x</clear>
          </error>
        )}
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
