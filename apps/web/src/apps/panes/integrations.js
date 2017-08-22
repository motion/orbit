import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view({
  store: class IntegrationsStore {
    get results() {
      return [
        {
          title: 'Setup Google Docs',
          data: 'google-docs',
          type: 'setup',
          icon: 'google',
        },
        {
          title: 'Setup Google Drive',
          data: 'google-drive',
          type: 'setup',
          icon: 'disk',
        },
        {
          title: 'Setup Dropbox Paper',
          data: 'dropbox-paper',
          type: 'setup',
          icon: 'dropbox',
        },
        {
          title: 'Setup Trello',
          data: 'trello',
          type: 'setup',
          icon: 'trello',
        },
        {
          title: 'Setup Jira',
          data: 'jira',
          type: 'setup',
          icon: 'jira',
        },
        {
          title: 'Setup Github',
          data: 'github',
          type: 'setup',
          icon: 'github',
        },
      ].map(x => ({
        ...x,
        category: 'Integrations',
      }))
    }
  },
})
export default class BarIntegrationsPane {
  render({ store, onRef, onSelect, activeIndex, paneProps }) {
    onRef(this)
    return (
      <integrations>
        <UI.List
          if={store.results}
          selected={activeIndex}
          onSelect={(item, index) => {
            onSelect(index)
          }}
          itemProps={paneProps.itemProps}
          groupKey="category"
          items={store.results}
          getItem={(result, index) =>
            <UI.ListItem
              highlight={index === activeIndex}
              key={result.id}
              icon={
                result.data && result.data.image
                  ? <img $image src={`/images/${result.data.image}.jpg`} />
                  : result.icon || (result.doc && result.doc.icon)
              }
              primary={result.title}
            />}
        />
      </integrations>
    )
  }

  static style = {
    setup: {
      padding: 20,
    },
  }
}
