import { ListsApp } from '@mcro/models'
import { Row } from '@mcro/ui'
import * as React from 'react'
import { lists } from '.'
import '../../../public/styles/emojimart.css'
import { CreateFolder } from '../../components/CreateFolder'
import { HorizontalSpace } from '../../views'

export default function ListEdit(props: { app: ListsApp; parentID: number }) {
  const handleAdd = async () => {
    lists.actions.receive(props.app, props.parentID, {
      target: 'folder',
      name: '',
    })
  }

  return (
    <Row flex={1} alignItems="center">
      <CreateFolder onAdd={handleAdd} />
      <HorizontalSpace />
    </Row>
  )
}
