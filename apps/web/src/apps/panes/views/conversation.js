import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { format } from 'date-fns'

@view
export default class Conversation {
  render({ data: { createdAt, messages }, authors, onTogglePerson }) {
    const imageMap = { nate: 'me', patrickhop: 'steph', steelbrain: 'steel' }
    const avatar = s => `/images/${imageMap[s] || s}.jpg`

    return (
      <convo>
        <info $$row>
          <UI.Title size={1.2}>{UI.Date.format(createdAt)}</UI.Title>

          <UI.Title $channel css={{ marginLeft: 10 }} size={1.2} opacity={0.6}>
            #{messages[0].channel}
          </UI.Title>
          {authors.map(author => (
            <UI.Button
              chromeless
              css={{ marginLeft: 10 }}
              icon={
                <img $avatar css={{ marginRight: -3 }} src={avatar(author)} />
              }
              onMouseDown={() => {
                onTogglePerson(author)
              }}
            >
              {author}
            </UI.Button>
          ))}
        </info>
        <texts>
          {messages.map((message, index) => {
            const { userName, text, channel, timestamp } = message
            const date = format(timestamp, 'HH:mm')

            const lastWho = index === 0 ? null : messages[index - 1].userName

            return (
              <item css={{ marginTop: 5 }}>
                <user if={lastWho !== userName} $$row>
                  <UI.Button
                    icon={
                      <img
                        css={{ marginRight: -3 }}
                        src={avatar(userName)}
                        $avatar
                      />
                    }
                    onMouseDown={() => onTogglePerson(userName)}
                    chromeless
                    $$row
                    css={{
                      marginBottom: 10,
                      fontWeight: 600,
                      marginRight: 10,
                    }}
                  >
                    {userName}
                  </UI.Button>
                  <UI.Text $date css={{ opacity: 0.7, marginTop: 5 }}>
                    {date}
                  </UI.Text>
                </user>
                <UI.Text $message css={{ marginLeft: 5, marginTop: -3 }}>
                  {text}
                </UI.Text>
              </item>
            )
          })}
        </texts>
      </convo>
    )
  }

  static style = {
    avatar: {
      width: 18,
      height: 18,
      borderRadius: 100,
      marginRight: 8,
    },
  }
}
