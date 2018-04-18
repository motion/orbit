import { view } from '@mcro/black'
import * as React from 'react'
import OrbitCardSlackMessage from './slackMessage'
import * as UI from '@mcro/ui'
import { App, Desktop } from '@mcro/all'
import { RoundButton } from '~/views'

const isntAttachment = x => !x.text || !x.text.match(/\<([a-z]+:\/\/[^>]+)\>/g)
const exampleTitles = [
  `Context, TSNE, Mobile App`,
  `Superhuman, Funny`,
  `Search, nlp, fluid`,
  `Sketching, creatively`,
]
const uids = {}

@view
export default class SlackConversation {
  render({ children, result, appStore, isExpanded }) {
    const setting = appStore.settings.slack
    const uid =
      uids[result.id] || Math.floor(Math.random() * exampleTitles.length)
    uids[result.id] = uid
    const slackChannelUrl = `slack://channel?id=${
      result.data.channel.id
    }&team=${setting.values.oauth.info.team.id}`
    return children({
      title: exampleTitles[uid],
      icon: 'slack',
      subtitle: (
        <subtitle>
          <div $$flex />
          <RoundButton
            onClick={e => {
              e.stopPropagation()
              App.sendMessage(Desktop, Desktop.messages.OPEN, slackChannelUrl)
            }}
          >
            {result.title}
          </RoundButton>
        </subtitle>
      ),
      bottom: (
        <UI.Icon
          name="link2"
          size={11}
          opacity={0.35}
          onClick={() =>
            App.sendMessage(
              Desktop,
              Desktop.messages.OPEN,
              `${slackChannelUrl}&message=${result.data.messages[0].ts}`,
              // result.data.permalink,
            )
          }
        />
      ),
      bottomAfter: (
        <row $meta>
          {result.people.length}
          &nbsp;
          <UI.Icon size={10} opacity={0.35} name="users_single-01" />
          &nbsp;&nbsp;
          {result.data.messages.length - 1}
          &nbsp;
          <UI.Icon size={10} opacity={0.35} name="chat" />
        </row>
      ),
      // via: result.title,
      preview: result.body,
      content: result.data.messages
        .filter(isntAttachment)
        .slice(0, 3)
        .map((message, index) => (
          <OrbitCardSlackMessage
            key={index}
            message={message}
            previousMessage={result.data.messages[index - 1]}
            bit={result}
            appStore={appStore}
          />
        )),
    })
  }

  static style = {
    subtitle: {
      flexFlow: 'row',
      flex: 1,
      opacity: 0.7,
    },
    meta: {
      flexFlow: 'row',
      opacity: 0.5,
    },
  }
}
