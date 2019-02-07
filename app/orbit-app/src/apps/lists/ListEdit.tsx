import { Row } from '@mcro/ui'
import * as React from 'react'
import '../../../public/styles/emojimart.css'
import { CreateFolder } from '../../components/CreateFolder'
import { HorizontalSpace } from '../../views'
import { ListsApp } from './ListsApp'
import { ListsAppBit } from './types'

export default function ListEdit(props: { app: ListsAppBit; parentID: number }) {
  return (
    <Row flex={1} alignItems="center">
      <CreateFolder
        onAdd={name => {
          ListsApp.api.receive(props.app, props.parentID, {
            target: 'folder',
            name,
          })
        }}
      />
      <HorizontalSpace />
    </Row>
  )
}
