import { Bit, createApp, useBitSearch, useStore } from '@o/kit'
import { CardStack, DefinitionList, Form, FormFieldsObj, Layout, Pane, Table, useActiveSearchQuery } from '@o/ui'
import React, { useMemo } from 'react'

/**
 * TODO we need a decent manager for bits in one location
 * This can be it, we need to figure out how the dock preview would lok
 */

export default createApp({
  id: 'bits',
  name: 'Manage Bits',
  icon: 'item',
  app: BitsApp,
})

class BitsAppStore {
  selected: Bit[] = []
  onSelect(rows: Bit[]) {
    this.selected = rows
  }

  get selectedField(): FormFieldsObj | null {
    const cur = this.selected[0]
    if (!cur) return null
    return Object.keys(cur).reduce((acc, key) => {
      return {
        ...acc,
        [key]: {
          label: key,
          value: cur[key],
        },
      }
    }, {})
  }
}

function BitsApp() {
  const bits = useBitSearch({ take: 5000 })
  const store = useStore(BitsAppStore)

  // const searchState = useSearchState()
  // const searchString = useDebounceValue(searchState.query, 200)
  // const [bits] = useBits({
  //   order: {
  //     bitCreatedAt: 'desc',
  //   },
  // })

  return (
    <Layout type="column">
      <Pane resizable>
        <Table
          searchable
          query={useActiveSearchQuery()}
          selectable="multi"
          onSelect={store.onSelect}
          shareable
          items={bits}
          columns={{
            id: {
              value: 'ID',
            },
            title: {
              value: 'title',
              flex: 2,
            },
            body: {
              value: 'Body',
              flex: 2,
            },
            appId: {
              value: 'appId',
            },
            authorId: {
              value: 'authorId',
            },
            photo: {
              value: 'Photo',
            },
            email: {
              value: 'Email',
            },
            data: {
              value: 'Data',
            },
            createdAt: {
              value: 'Created',
            },
            updatedAt: {
              value: 'Updated',
            },
          }}
        />
      </Pane>
      <Pane flex={1.3}>
        <Layout type="row">
          <Pane title="Selected Bits" padding overflow="hidden">
            <CardStack>
              {store.selected.map((item, index) => (
                <DefinitionList key={item.id || index} row={item} />
              ))}
            </CardStack>
          </Pane>
          <Pane title="Selected Bits" padding>
            {store.selectedField && <Form fields={store.selectedField} />}
          </Pane>
        </Layout>
      </Pane>
    </Layout>
  )
}
