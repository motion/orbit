// @flow
import React from 'react'
import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import { Document } from '@mcro/models'

window.Document = Document

const Doc = ({ doc }) =>
  <doc>
    {doc.title}
    <UI.Button
      onClick={() => {
        doc.title = Math.random() + ''
        doc.save()
      }}
    >
      {' '}do it
    </UI.Button>
  </doc>

@view.attach('dataStore')
@view
class DataList {
  render({ dataStore }) {
    log('dataStore', dataStore.items)
    return (
      <dataItems if={dataStore.items}>
        {dataStore.items.map(item => <Doc doc={item} key={item._id} />)}
      </dataItems>
    )
  }
}

@view.provide({
  dataStore: class DataStore {
    // reactive = Document.findOrCreate({ title: 'new' })
    @watch items = () => Document.all()
    create = () => Document.create()
  },
})
class DataPlayground {
  render({ show, dataStore }) {
    if (!show) {
      return null
    }

    return (
      <data>
        <current if={dataStore.reactive}>
          {dataStore.reactive.title}
        </current>

        <DataList />

        <UI.Button onClick={dataStore.create}>create doc</UI.Button>
      </data>
    )
  }
}

@view({
  store: class {
    show = false
  },
})
export default class DataPlaygroundView {
  render({ store }) {
    return (
      <data>
        <DataPlayground show={store.show} />
        <DataPlayground show={!store.show} />
        <UI.Button onClick={store.ref('show').toggle}>button</UI.Button>
      </data>
    )
  }
}
