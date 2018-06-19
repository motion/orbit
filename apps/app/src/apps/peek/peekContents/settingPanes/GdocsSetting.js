import * as UI from '@mcro/ui'
import { view, react } from '@mcro/black'
import { sortBy, reverse } from 'lodash'
import App from '~/app'
import { formatDistance } from 'date-fns'

const baseId = '0AKfTFZu-thXbUk9PVA'
const truncate = (s, n) => (s.length > n ? s.substring(0, n) + '...' : s)

@view
class Folder {
  // recursive use of stores was raising issues
  state = { open: false, showAllFiles: false }

  render({ id = baseId, folders, files }) {
    const current = folders.filter(f => f.id === id)
    const { name } = current.length > 0 ? current[0] : { name: 'home' }
    const { open, showAllFiles } = this.state
    const childFolders = folders.filter(i => i.parents && i.parents[0] === id)
    const childFiles = reverse(
      sortBy(
        files.filter(i => i.parentId === id),
        item => item.data.modifiedTime,
      ),
    )
    const isBase = id === baseId
    const yearInMs = 3.154e10
    const showFiles = showAllFiles
      ? childFiles
      : childFiles.filter(
          (item, index) =>
            index < 10 ||
            +Date.now() - +new Date(item.data.modifiedTime) < yearInMs,
        )
    const moreFiles = childFiles.length - showFiles.length
    return (
      <folder>
        <bar onClick={() => this.setState({ open: !open })} $$row>
          <UI.Text fontWeight={500} css={{ userSelect: 'none' }}>
            {name}
          </UI.Text>
          <UI.Text css={{ userSelect: 'none', marginLeft: 10 }} opacity={0.5}>
            <b>{childFolders.length + childFiles.length}</b> items
          </UI.Text>
        </bar>
        <content open={isBase ? true : open}>
          <content>
            <folders>
              {childFolders.map(folder => (
                <Folder
                  key={folder.id}
                  folders={folders}
                  files={files}
                  id={folder.id}
                />
              ))}
            </folders>
            <noItems if={showFiles.length === 0 && childFolders.length === 0}>
              <UI.Text css={{ marginLeft: 15 }} opacity={0.8}>
                No Files
              </UI.Text>
            </noItems>
            <items>
              {showFiles.map(item => (
                <container $$row>
                  <UI.Button
                    $item
                    chromeless
                    ellipse={20}
                    icon="/images/google-doc-icon.svg"
                    // make up for button padding
                    css={{ marginTop: -1, marginBottom: -1, marginLeft: -10 }}
                  >
                    {truncate(item.title, 20)}
                  </UI.Button>
                  <UI.Text opacity={0.7}>
                    edited {formatDistance(item.data.modifiedTime, Date.now())}{' '}
                    ago
                  </UI.Text>
                </container>
              ))}
            </items>
            <more if={moreFiles > 0} $$row>
              <UI.Button
                $more
                onClick={() => this.setState({ showAllFiles: true })}
              >
                {moreFiles} files edited more than 1 year ago
              </UI.Button>
            </more>
          </content>
        </content>
      </folder>
    )
  }

  static style = {
    folder: {
      marginTop: 2,
      marginBottom: 2,
    },
    title: {
      userSelect: 'none',
    },
    content: {
      margin: [5, 10],
    },
    container: {
      alignItems: 'center',
    },
    more: {
      marginTop: 5,
    },
  }
}

@view({
  store: class GDocsSettingStore {
    get setting() {
      return this.props.appStore.settings.gdocs
    }

    get service() {
      return this.props.appStore.services.gdocs
    }

    folders = react(() => this.service && this.service.getFiles())

    get files() {
      return (this.things || []).filter(t => t.type === 'doc')
    }
  },
})
export class GdocsSetting {
  render({ store }) {
    const loading = !store.folders
    return (
      <container>
        <loading if={loading}>loading</loading>
        <Folder if={!loading} folders={store.folders} files={store.files} />
      </container>
    )
  }

  static style = {
    container: {
      marginTop: 5,
    },
  }
}
