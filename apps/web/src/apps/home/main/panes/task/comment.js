import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { CurrentUser } from '~/app'
import { format } from './helpers'

@view
export default class TaskComment {
  render({ store, data: { id, issueBody = false, body, createdAt, author } }) {
    const { github } = CurrentUser.authorizations
    const isOwner = author && github && github.info.username === author.login

    return (
      <comment if={author} $$row>
        <user>
          <img $avatar src={author.avatarUrl} />
        </user>
        <content>
          <info>
            <userheader>
              <UI.Text size={1.1} $name>
                {author.login}
              </UI.Text>
              <UI.Date $when opacity={0.5}>
                {createdAt}
              </UI.Date>
            </userheader>
            <buttons $$row>
              <UI.Button if={isOwner} chromeless icon="edit" opacity={0.7} />
              <UI.Button
                if={!issueBody && isOwner}
                onClick={() => store.deleteComment(id)}
                chromeless
                icon="remove"
                opacity={0.7}
              />
            </buttons>
          </info>
          <UI.Text $body html={format(body)} />
        </content>
      </comment>
    )
  }

  static style = {
    comment: {
      width: '100%',
      padding: [5, 10],
      border: [1, [0, 0, 0, 0]],
      transition: 'all 150ms ease-in',
    },
    user: {
      userSelect: 'none',
    },
    info: {
      flexFlow: 'row',
      justifyContent: 'space-between',
      userSelect: 'none',
    },
    userheader: {
      flexFlow: 'row',
    },
    avatar: {
      alignSelf: 'center',
      width: 20,
      height: 20,
      borderRadius: 100,
      marginRight: 16,
      marginTop: 0,
    },
    content: {
      flex: 1,
    },
    when: {
      marginLeft: 5,
    },
    body: {
      padding: [5, 0, 8],
      flex: 1,
      width: '95%',
    },
    name: {
      fontWeight: 500,
    },
  }
}
