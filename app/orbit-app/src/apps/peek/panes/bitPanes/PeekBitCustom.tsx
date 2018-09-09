import * as React from 'react'
import { view, compose } from '@mcro/black'
import { PeekBitPaneProps } from './PeekBitPaneProps'
import {
  Sidebar,
  Row,
  SidebarLabel,
  Panel,
  Col,
  Tabs,
  Tab,
  Theme,
  SearchableTable,
  Text,
} from '@mcro/ui'
import { DateFormat } from '../../../../views/DateFormat'
import { ReactiveCheckBox } from '../../../../views/ReactiveCheckBox'

type Props = PeekBitPaneProps & {
  store: CustomStore
}

class CustomStore {
  syncing = {}
  active = 'status'

  setActiveKey = key => {
    this.active = key
  }

  columnSizes = {
    name: '25%',
    topic: '25%',
    members: '20%',
    createdAt: '15%',
    active: '15%',
  }

  handleColumnSize = sizes => {
    console.log('handling', sizes)
    this.columnSizes = sizes
  }

  rows = [{ id: 0, title: 'Test', topic: 'Two', created: Date.now() }].map(
    (item, index) => {
      const isActive = () => this.syncing[item.id]
      return itemToRow(index, item, isActive)
    },
  )
  highlightedRows = []

  handleEnter = e => {
    console.log('enter!!', e)
    if (this.highlightedRows.length) {
      console.log('were highlighted', this.highlightedRows)
      e.preventDefault()
      e.stopPropagation()
    }
  }

  handleHighlightedRows = rows => {
    this.highlightedRows = rows
  }
}

const decorator = compose(
  view.attach({
    store: CustomStore,
  }),
  view,
)

export const Custom = decorator(({ store }: Props) => {
  return (
    <Row flex={1}>
      <Sidebar minWidth={150} maxWidth={300} width={200} position="left">
        <SidebarLabel>test me</SidebarLabel>
        testing 123
        <Panel heading="Test" collapsable>
          this is a panel
        </Panel>
      </Sidebar>
      <Col flex={1}>
        <Theme select={theme => theme.titleBar || theme}>
          <Tabs active="first">
            <Tab key="first" width="50%" label="First Tab" />
            <Tab key="second" width="50%" label="Second Tab" />
          </Tabs>
        </Theme>
        <SearchableTable
          virtual
          rowLineHeight={28}
          floating={false}
          columnSizes={store.columnSizes}
          columns={columns}
          multiHighlight
          onRowHighlighted={store.handleHighlightedRows}
          rows={store.rows}
        />
        <Col flex={1} alignItems="center" justifyContent="center" />
      </Col>
    </Row>
  )
})

const columns = {
  name: {
    value: 'Name',
    sortable: true,
    resizable: true,
  },
  topic: {
    value: 'Topic',
    sortable: true,
    resizable: true,
  },
  createdAt: {
    value: 'Created',
    sortable: true,
    resizable: true,
  },
  active: {
    value: 'Active',
    sortable: true,
  },
}

const itemToRow = (index, channel, isActive) => {
  return {
    key: `${index}`,
    columns: {
      name: {
        sortValue: channel.title,
        value: channel.title,
      },
      topic: {
        sortValue: channel.topic,
        value: channel.topic,
      },
      createdAt: {
        sortValue: channel.created,
        value: (
          <Text ellipse>
            <DateFormat date={new Date(channel.created * 1000)} />
          </Text>
        ),
      },
      active: {
        sortValue: isActive,
        value: <ReactiveCheckBox onChange={_ => _} isActive={isActive} />,
      },
    },
  }
}
