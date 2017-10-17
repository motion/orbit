import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { CurrentUser } from '~/app'
import { format } from './helpers'
import { Title } from '~/views'

@view
export default class TaskComment {
  render({
    index,
    taskStore,
    data: { id, issueBody = false, body, createdAt, author },
  }) {
    const { github } = CurrentUser.authorizations
    const isOwner = author && github && github.info.username === author.login

    return (
      <comment if={author}>
        <prefix $headerRow>
          <Title size={1.5}>{index}</Title>
        </prefix>
        <content>
          <info>
            <userheader $headerRow>
              <img $avatar src={author.avatarUrl} />
              <UI.Text size={1.2} $name>
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
                onClick={() => taskStore.deleteComment(id)}
                chromeless
                icon="remove"
                opacity={0.7}
              />
            </buttons>
          </info>
          <innerContent>
            <UI.Text
              size={1.1}
              className="github-comment"
              $body
              html={format(body)}
            />
          </innerContent>
        </content>
      </comment>
    )
  }

  static style = {
    comment: {
      flex: 1,
      padding: [10, 20],
      border: [1, [0, 0, 0, 0]],
      transition: 'all 150ms ease-in',
      borderBottom: [1, 'dotted', '#eee'],
      flexFlow: 'row',
    },
    prefix: {
      flexFlow: 'row',
      userSelect: 'none',
      alignItems: 'center',
    },
    avatar: {
      width: 30,
      height: 30,
      borderRadius: 100,
      marginRight: 10,
      marginLeft: -5,
    },
    info: {
      flexFlow: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      userSelect: 'none',
      padding: [4, 0],
    },
    headerRow: {
      height: 42,
    },
    userheader: {
      flexFlow: 'row',
      alignItems: 'center',
    },
    content: {
      flex: 1,
      padding: [0, 20],
    },
    when: {
      marginLeft: 5,
    },
    body: {
      padding: [15, 0, 0],
      flex: 1,
      width: '95%',
    },
    name: {
      fontWeight: 500,
    },
  }
}
