import React from 'react'

export default class Splash extends React.Component {
  render() {
    return (
      <loader>
        loading
      </loader>
    )
  }

  static style = {
    loader: {
      width: '100%',
      height: '100%',
      // backgroundImage: 'url(https://grasshoppermind.files.wordpress.com/2012/05/five-lined-pyramids.jpg)',
      backgroundPosition: 'center center',
      backgroundSize: 'cover',
      filter: 'contrast(100%) brightness(1)',
    },
  }
}
