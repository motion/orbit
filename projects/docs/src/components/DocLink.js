import React from 'react'
import config from '../../package.json'

function DocLink({ path, children }) {
  return <a href={`${config.docsUrl}${path}`}>{children}</a>
}

export default DocLink
