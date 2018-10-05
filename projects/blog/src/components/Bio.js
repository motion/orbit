import React from 'react'

import icon from '../assets/notch.png'
import { rhythm } from '../utils/typography'

class Bio extends React.Component {
  render() {
    return (
      <div
        style={{
          display: 'flex',
          marginBottom: rhythm(2.5),
        }}
      >
        <img
          src={icon}
          alt={'Orbit'}
          style={{
            marginRight: rhythm(1 / 2),
            marginBottom: 0,
            width: 'auto',
            height: rhythm(2),
          }}
        />
        <p>
          We're building a new way to organize knowledge.
          <br />
          <a href="https://tryorbit.com">Join our mailing list for monthly updates</a>.
        </p>
      </div>
    )
  }
}

export default Bio
