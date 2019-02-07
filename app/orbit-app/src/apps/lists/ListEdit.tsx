import { AppByType, AppType } from '@mcro/models'
import { Row } from '@mcro/ui'
import * as React from 'react'
import '../../../public/styles/emojimart.css'
import { CreateFolder } from '../../components/CreateFolder'
import { HorizontalSpace } from '../../views'
import { ListsApp } from './ListsApp'

export default function ListEdit(props: { app: AppByType<AppType.lists>; parentID: number }) {
  const handleAdd = name => {
    ListsApp.api.receive(props.app, props.parentID, {
      target: 'folder',
      name,
    })
  }

  return (
    <Row flex={1} alignItems="center">
      <CreateFolder onAdd={handleAdd} />
      <HorizontalSpace />
    </Row>
  )
}
