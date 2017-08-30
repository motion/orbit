import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view({
  store: class IntegrationsStore {
    get results() {
      return [
        {
          title: 'Setup Github',
          data: { type: 'github', name: 'Github' },
          type: 'setup',
          icon: 'github',
        },
        {
          title: 'Setup Google',
          data: { type: 'google', name: 'Google' },
          type: 'setup',
          icon: 'google',
        },
        {
          title: 'Setup Dropbox',
          data: { type: 'dropbox-paper', name: 'Dropbox Paper' },
          type: 'setup',
          icon: 'dropbox',
        },
        {
          title: 'Setup Trello',
          data: { type: 'trello', name: 'Trello' },
          type: 'setup',
          icon: 'trello',
        },
        {
          title: 'Setup Jira',
          data: { type: 'jira', name: 'Jira' },
          type: 'setup',
          icon: 'atlass',
        },
      ].map(x => ({
        ...x,
        category: 'Integrations',
      }))
    }
  },
})
export default class BarIntegrationsPane {
  componentDidMount() {
    this.props.onSelect(this.props.store.results[0])
  }

  render({ store, onSelect, itemProps }) {
    return (
      <integrations>
        <UI.List
          if={store.results}
          controlled
          defaultSelected={0}
          onSelect={onSelect}
          groupKey="category"
          items={store.results}
          itemProps={itemProps}
          getItem={result => ({
            primary: result.title,
            icon:
              result.data && result.data.image
                ? <img $image src={`/images/${result.data.image}.jpg`} />
                : result.icon || (result.doc && result.doc.icon),
          })}
        />
      </integrations>
    )
  }
}
