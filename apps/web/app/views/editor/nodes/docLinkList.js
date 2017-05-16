import { node, view, computed } from '~/helpers'
import App, { Document } from '@jot/models'
import { Button, Loading, Icon } from '~/ui'
import { isEqual } from 'lodash'
import Router from '~/router'
import CardList from './lists/card'
import GridList from './lists/grid'

class DocListStore {
  // checking for inline prevents infinite recursion!
  //  <Editor inline /> === showing inside a document
  docs = !this.props.editorStore.inline &&
    Document.forHashtag(
      this.place && this.place.slug,
      this.props.node.data.get('hashtag')
    )

  get place() {
    return App.activePage.place
  }

  newHashtag = null
  saveName() {
    const { node: { data }, onChange } = this.props

    onChange(data.set('hashtag', this.newHashtag))
    this.newHashtag = null
  }

  @computed get inputHashtag() {
    return this.newHashtag || this.props.node.data.get('hashtag')
  }
}

const lightBlue = '#e7f6ff'
const darkBlue = `#0099e5`

@node
@view({
  store: DocListStore,
})
export default class DocLinkList {
  render({ node, editorStore, editing, store, children, ...props }) {
    const hasLoaded = !!store.docs
    const hasDocs = hasLoaded && store.docs.length > 0
    const hashtag = node.data.get('hashtag')

    return (
      <container contentEditable={false}>
        <latest $$row>
          latest #
          <input
            $edit
            spellcheck={false}
            onFocus={() => store.newHashtag = hashtag}
            onChange={e => store.newHashtag = e.target.value}
            onBlur={store.saveName}
            onKeyDown={e => e.which == 13 && e.target.blur()}
            value={store.inputHashtag}
          />
        </latest>
        <list>
          <loading if={!hasLoaded}><Loading $loading /></loading>
          <noDocs if={hasLoaded && !hasDocs}>no documents in #{hashtag}</noDocs>
          <docs if={hasLoaded && hasDocs}>
            {(store.docs || []).map((doc, index) => (
              <item
                key={doc._id}
                onClick={() => Router.go(doc.url())}
                $notFirst={index > 0}
              >
                <Icon
                  name="arrows-1_circle-right-37"
                  $icon
                  color={darkBlue}
                  size={20}
                />

                <text>{doc.title}</text>
              </item>
            ))}
          </docs>
        </list>
      </container>
    )
  }

  static style = {
    container: {
      marginTop: 5,
      marginBottom: 5,
    },
    input: {
      padding: 0,
      marginLeft: '1px !important',
      fontSize: 14,
      borderWidth: 0,
      marginLeft: 2,
      marginTop: 1,
      width: 150,
      '&:focus': {},
      '&:hover': {
        borderBottom: '1px dashed #333',
      },
    },
    latest: {
      justifyItems: 'flex-end',
      alignText: 'right',
      fontSize: 14,
      color: '#555',
    },
    list: {
      background: '#fafdff',
      borderRadius: 5,
      border: `1px solid ${lightBlue}`,
    },
    loading: {
      padding: 20,
    },
    noDocs: {
      alignItems: 'center',
      padding: 20,
      color: darkBlue,
      fontSize: 24,
      fontWeight: 300,
    },
    item: {
      flexFlow: 'row',
      fontSize: 17,
      cursor: 'pointer',
      color: darkBlue,
      fontWeight: 300,
      marginLeft: 15,
      alignItems: 'center',
      padding: 5,
      opacity: 0.8,
      transition: 'opacity 100ms ease-in',
      '&:hover': { opacity: 1 },
    },
    icon: {
      opacity: 0.8,
    },
    text: {
      padding: [16, 0, 14, 10],
    },
    notFirst: {
      borderTop: `1px solid ${lightBlue}`,
    },
  }
}
