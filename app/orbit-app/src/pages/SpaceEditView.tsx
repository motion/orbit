import { save } from '@o/bridge'
import { AppBit, AppModel, Space, SpaceModel } from '@o/models'
import * as UI from '@o/ui'
import { InputRow, Message, Table, VerticalSpace } from '@o/ui'
import { react, useStore } from '@o/use-store'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { AppActions } from '../actions/appActions/AppActions'

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

export default observer(function SpaceEditView(props: Props) {
  const store = useStore(SpaceEditViewStore, props)

  const handleSave = async e => {
    e.preventDefault()

    // create a space
    const savedSpace = await save(SpaceModel, {
      ...store.space,
      ...store.values,
    })

    console.log('saved space:', savedSpace)

    // create a list app for the created space
    const listsApp: AppBit = {
      target: 'app',
      name: 'Lists',
      identifier: 'lists',
      spaceId: savedSpace.id,
      // data: {
      //   lists: [
      //     { name: 'list #1', order: 0, pinned: false },
      //     { name: 'list #2', order: 0, pinned: false },
      //     { name: 'list #3', order: 0, pinned: false },
      //   ],
      // },
    }
    await save(AppModel, listsApp)

    store.values = { name: '', colors: [] }
    AppActions.clearPeek()
  }

  const handleChange = (prop: keyof Space) => (val: Space[typeof prop]) => {
    store.values = {
      ...store.values,
      [prop]: val,
    }
  }

  const { values } = store
  return (
    <UI.Col tagName="form" onSubmit={handleSave} padding={20}>
      <Message>Enter space name and choose the color.</Message>
      <VerticalSpace />
      <UI.Col margin="auto" width={370}>
        <UI.Col padding={[0, 10]}>
          <Table>
            {/* !TODO */}
            <InputRow label="Name" value={values.name} onChange={handleChange('name') as any} />
          </Table>
          <VerticalSpace />
          <UI.Theme
            theme={{
              color: '#fff',
              background: '#4C36C4',
            }}
          >
            <UI.Button type="submit">Save</UI.Button>
          </UI.Theme>
          <VerticalSpace />
        </UI.Col>
      </UI.Col>
    </UI.Col>
  )
})
