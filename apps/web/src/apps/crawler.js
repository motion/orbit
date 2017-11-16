import * as React from 'react'
import Crawler from '@mcro/crawler/lib/browser/root'

// this view helps test out crawler UI easily

export default class extends React.Component {
  render() {
    return (
      <div>
        <h1>I am a banana</h1>
        <test>
          Disposable-Event Greenkeeper badge disposable-event is an npm module
          built to normalize event registration and disposal. We have often
          dealt with situations where there are inconsistent ways to add or
          remove event listeners in different APIs, disposable-event normalizes
          them all and gives authors a beautiful API Installation
        </test>
        <thing>
          function disposableEvent(target, eventName, callback): Disposable
        </thing>
        <another>
          cense This project is licensed under the terms of MIT License, see the
          LICENSE file for
        </another>
        <Crawler />
      </div>
    )
  }
}
