// @flow
import React from 'react'
import { view } from '@jot/black'
import { Button } from '~/ui'
import { Document } from '@jot/models'

type Props = {
  id: number,
  store: object,
}

@view({
  store: class ChildrenStore {
    docs = Document.child(this.props.id)

    add = async () => {
      const { id } = this.props
      await Document.create({ parentId: id })
    }
  },
})
export default class Children {
  props: Props

  render({ id, store }: Props) {
    const { docs } = store

    return (
      <children $$row>
        <docs>
          {(docs || []).map(doc =>
            <doc onClick={() => Router.go(doc.url())}>
              <box />
              <name>{doc.getTitle()}</name>
            </doc>
          )}
        </docs>
        <Button
          circular
          iconSize={20}
          size={50}
          $circleButton
          icon="siadd"
          onClick={store.add}
        />
      </children>
    )
  }

  static style = {
    children: {
      padding: 30,
      alignItems: 'center',
      borderTop: '1px dotted #eee',
    },

    box: {
      width: 50,
      height: 80,
      alignSelf: 'center',
      border: '1px solid #ccc',
      background: '#f1f1f1',
    },

    doc: {
      marginRight: 20,
    },

    docs: {
      flexFlow: 'row',
    },

    name: {
      textAlign: 'center',
      marginTop: 10,
    },
  }
}
