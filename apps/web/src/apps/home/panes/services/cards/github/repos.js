import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import { sortBy, reverse } from 'lodash'

@view.attach('githubStore')
@view
class Repo {
  render({ githubStore, repo }) {
    githubStore.syncVersion

    return (
      <container $$row>
        <left $$row>
          <UI.Field
            row
            size={1.2}
            type="toggle"
            onChange={val => {
              githubStore.onSync(repo, val)
            }}
            defaultValue={githubStore.isSyncing(repo)}
          />
          <repo>
            <UI.Title size={1.2} fontWeight={600} color="#000" marginBottom={1}>
              {repo.name}
            </UI.Title>
            <info $$row>
              <left $$row>
                <UI.Text size={0.9}>last commit</UI.Text>
                <UI.Date size={0.9} $updatedAt>
                  {repo.pushedAt}
                </UI.Date>
              </left>
              <private
                css={{ marginLeft: 10, alignItems: 'center' }}
                if={repo.private}
                $$row
              >
                <UI.Icon name="lock" size={12} />
                <UI.Text size={0.9} css={{ marginLeft: 5 }} fontWeight={500}>
                  private
                </UI.Text>
              </private>
            </info>
          </repo>
        </left>

        <syncers>
          <content $$row>
            <UI.Text>{repo.openIssuesCount} open issues</UI.Text>
          </content>
        </syncers>
      </container>
    )
  }

  static style = {
    container: {
      marginTop: 8,
      justifyContent: 'space-between',
    },
    repo: {
      minWidth: 250,
      marginLeft: 15,
    },
    sync: {
      marginLeft: 20,
      flexFlow: 'row',
      background: [0, 0, 0, 0.01],
      border: '1px solid rgba(0,0,0,.08)',
      padding: [0, 10],
      borderRadius: 3,
    },
    syncTitle: {
      marginRight: 10,
    },
    updatedAt: {
      marginLeft: 5,
    },
  }
}

@view({
  store: class ReposStore {
    showAll = false
  },
})
export default class Repos {
  render({ repos, store }) {
    const oneMonth = 2628000000
    const recent = store.showAll
      ? repos
      : repos.filter(r => +Date.now() - +new Date(r.pushedAt) < oneMonth * 2)

    return (
      <repos>
        {reverse(sortBy(recent, 'pushedAt')).map(repo => (
          <Repo store={store} repo={repo} />
        ))}
        <buttons $$row>
          <UI.Button
            if={repos.length !== recent.length}
            onClick={() => (store.showAll = true)}
            $add
            icon="simple-add"
          >
            show {repos.length - recent.length} more
          </UI.Button>
        </buttons>
      </repos>
    )
  }

  static style = {
    repos: {
      margin: [5, 20],
    },
    buttons: {
      justifyContent: 'center',
    },
    add: {
      marginTop: 10,
    },
  }
}
