import * as React from 'react'

export const catchesRenderErrors = () => ({
  decorator: Klass => {
    const ogRender = Klass.prototype.render
    if (ogRender) {
      Klass.prototype.render = function(...args) {
        try {
          return ogRender(...args)
        } catch (err) {
          return (
            <div css={{ background: 'red', color: '#fff' }}>
              <title>{err.message}</title>
              <pre css={{ padding: 10 }}>{err.stack}</pre>
            </div>
          )
        }
      }
    }
  },
})
