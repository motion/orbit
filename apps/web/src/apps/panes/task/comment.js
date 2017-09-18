import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { CurrentUser } from '~/app'

@view
export default class TaskComment {
  render({ store, data: { id, issueBody = false, body, createdAt, author } }) {
    const isOwner =
      author && CurrentUser.github.profile.username === author.login

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
              <UI.Date $when color={[255, 255, 255, 0.5]}>
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
          <UI.Text lineHeight={23} $body>
            {body}
          </UI.Text>
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
    info: {
      flexFlow: 'row',
      justifyContent: 'space-between',
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
