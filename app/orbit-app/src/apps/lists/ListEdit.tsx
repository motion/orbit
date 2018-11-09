import { attach, view } from '@mcro/black'
import { save } from '@mcro/model-bridge'
import { loadOne } from '@mcro/model-bridge'
import { AppModel, ListsApp } from '@mcro/models'
import { AppType } from '@mcro/models'
import * as UI from '@mcro/ui'
import * as React from 'react'
import { SpaceStore } from '../../stores/SpaceStore'
import * as Views from '../../views'

class ListEditStore {
  name: string = ''
}

@attach({
  store: ListEditStore,
  spaceStore: SpaceStore,
})
@view
export class ListEdit extends React.Component<
  { store?: ListEditStore, spaceStore?: SpaceStore }
> {

  save = async e => {
    e.preventDefault()

    let listsApp: ListsApp = await loadOne(AppModel, {
      args: {
        type: 'lists' as AppType,
        spaceId: this.props.spaceStore.activeSpace.id
      }
    })
    if (!listsApp) {
      listsApp = {
        type: 'lists',
        name: 'lists',
        spaceId: this.props.spaceStore.activeSpace.id,
        data: {
          lists: []
        }
      }
    }

    listsApp.data.lists.push({ name: this.props.store.name, order: 0, pinned: false, bits: [] })

    // create a space
    await save(AppModel, listsApp)
    console.log("saved lists app", listsApp)

    this.props.store.name = ''
  }

  handleNameChange = (name: string) => this.props.store.name = name

  render() {
    return (
      <UI.Col tagName="form" onSubmit={this.save} padding={20}>
        <Views.VerticalSpace />
        <UI.Col margin="auto" width={370}>
          <UI.Col padding={[0, 10]}>
            <Views.Table>
              <Views.InputRow
                label="New list name"
                value={this.props.store.name}
                onChange={this.handleNameChange}
              />
            </Views.Table>
            <Views.VerticalSpace />
            <UI.Theme
              theme={{
                color: '#fff',
                background: '#4C36C4',
              }}
            >
              <UI.Button type="submit">
                add list
              </UI.Button>
            </UI.Theme>
            <Views.VerticalSpace />
          </UI.Col>
        </UI.Col>
      </UI.Col>
    )
  }
}
