import React from 'react'

export default class Splash extends React.Component {
  render() {
    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: 100,
          WebkitAppRegion: 'drag',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none',
        }}
      >
        loading
      </div>
    )
  }
}
