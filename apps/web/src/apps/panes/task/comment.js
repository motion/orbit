import { view } from '@mcro/black'
import timeAgo from 'time-ago'
import * as UI from '@mcro/ui'

const { ago } = timeAgo()

@view
export default class Comment {
  render({
    isActive,
    store,
    data: { id, issueBody = false, body, createdAt, author },
  }) {
    /*
    const name = includes(author, ' ')
      ? author.split(' ')[0].toLowerCase()
      : author
    const image = name === 'nate' ? 'me' : name
    */
    const isOwner =
      author && CurrentUser.github.profile.username === author.login

    return (
      <comment if={author} $$row $isActive={isActive}>
        <user>
          <img $avatar src={author.avatarUrl} />
        </user>
        <content>
          <info $$row>
            <left $$row>
              <UI.Text $name>{author.login}</UI.Text>
              <UI.Text $when>{ago(new Date(createdAt))}</UI.Text>
            </left>
            <buttons $$row>
              <UI.Button if={isOwner} chromeless icon="edit" opacity={0.7} />
              <UI.Button
                if={!issueBody && isOwner}
                onClick={() => store.removeComment(body)}
                chromeless
                icon="remove"
                opacity={0.7}
              />
            </buttons>
          </info>
          <UI.Text $body>{body}</UI.Text>
        </content>
      </comment>
    )
  }

  static style = {
    comment: {
      padding: 10,
      border: [1, [0, 0, 0, 0]],
      transition: 'all 150ms ease-in',
    },
    info: {
      justifyContent: 'space-between',
    },
    left: {
      marginTop: 3,
    },
    isActive: {
      border: [1, [0, 0, 0, 0.2]],
      boxShadow: '0px 0px 4px rgba(0,0,0,0.2)',
    },
    avatar: {
      alignSelf: 'center',
      width: 30,
      height: 30,
      borderRadius: 100,
      marginRight: 10,
    },
    content: {
      flex: 1,
    },
    when: {
      marginLeft: 5,
    },
    body: {
      padding: [3, 0],
      flex: 1,
      width: '95%',
    },
    name: {
      fontWeight: 500,
    },
  }
}
