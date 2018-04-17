import * as React from 'react'
import { view } from '@mcro/black'
import SlackConversation from './orbitCard/slackConversation'

@view
export default class OrbitCardContent {
  render({ result }) {
    return (
      <React.Fragment>
        <SlackConversation if={result.integration === 'slack'} bit={result} />
      </React.Fragment>
    )
  }

  static style = {}
}
