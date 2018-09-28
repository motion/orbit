import React from 'react'

import 'typeface-clear-sans'

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
          alt={'Kyle Mathews'}
          style={{
            marginRight: rhythm(1 / 2),
            marginBottom: 0,
            width: 'auto',
            height: rhythm(2),
          }}
        />
        <p>
          Welcome to the Orbit development blog. We're building a new way to
          organize knowledge.{' '}
          <a href="https://twitter.com/tryorbit">
            You can follow us on Twitter
          </a>
        </p>
      </div>
    )
  }
}

export default Bio
