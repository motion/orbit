// @flow
import React from 'react'
import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import { Document } from '@mcro/models'

window.Document = Document

@view({
  store: class DataStore {
    reactive = Document.findOrCreate({ title: 'new' })
    @watch all = () => Document.all()
    create = () => Document.create()
  },
})
export default class DataPlayground {
  render({ store }) {
    window.store = store
    return (
      <data>
        <current if={store.reactive}>
          {store.reactive.title}
        </current>

        <all if={store.all}>
          {store.all.map(doc =>
            <doc key={doc._id}>
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
          )}
        </all>

        <UI.Button onClick={store.create}>create doc</UI.Button>
      </data>
    )
  }
}
