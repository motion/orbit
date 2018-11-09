import { attach, react, view } from '@mcro/black'
import { save } from '@mcro/model-bridge'
import { AppModel, ListsApp, Space, SpaceModel } from '@mcro/models'
import * as UI from '@mcro/ui'
import * as React from 'react'
import { AppActions } from '../actions/AppActions'
import * as Views from '../views'
import { Message } from '../views/Message'

type Props = {
  space?: Space
}

class SpaceEditViewStore {
  props: Props
  values = {
    name: '',
    colors: ['red', 'yellow'],
  }

  space = react(
    () => this.props.space,
    async space => {
      // if space was sent via component props then use it
      if (space) {
        this.values = { name: space.name, colors: space.colors }
        return space
      }

      // create a new empty space
      return {
        name: '',
        colors: [],
      } as Space
    },
  )
}

@attach({
  store: SpaceEditViewStore,
})
@view
export class SpaceEditView extends React.Component<
  Props & { store?: SpaceEditViewStore }
> {

  save = async e => {
    e.preventDefault()
    const { space } = this.props.store

    // create a space
    const savedSpace = await save(SpaceModel, {
      ...space,
      ...this.props.store.values
    })

    console.log("saved space:", savedSpace)

    // create a list app for the created space
    const listsApp: ListsApp = {
      name: "Lists",
      type: "lists",
      spaceId: savedSpace.id,
      data: {
        lists: [
          { name: "list #1", order: 0, pinned: false },
          { name: "list #2", order: 0, pinned: false },
          { name: "list #3", order: 0, pinned: false }
        ]
      }
    }
    await save(AppModel, listsApp)

    this.props.store.values = { name: '', colors: [] }
    AppActions.clearPeek()
  }

  handleChange = (prop: keyof Space) => (val: Space[typeof prop]) => {
    this.props.store.values = {
      ...this.props.store.values,
      [prop]: val,
    }
  }

  render() {
    const { values } = this.props.store
    return (
      <UI.Col tagName="form" onSubmit={this.save} padding={20}>
        <Message>
          Enter space name and choose the color.
        </Message>
        <Views.VerticalSpace />
        <UI.Col margin="auto" width={370}>
          <UI.Col padding={[0, 10]}>
            <Views.Table>
              <Views.InputRow
                label="Name"
                value={values.name}
                onChange={this.handleChange('name')}
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
                Save
              </UI.Button>
            </UI.Theme>
            <Views.VerticalSpace />
          </UI.Col>
        </UI.Col>
      </UI.Col>
    )
  }
}
