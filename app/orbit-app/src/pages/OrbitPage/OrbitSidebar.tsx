import { Col } from '@o/gloss'
import { AppLoadContext, AppMainViewProps, SubPane } from '@o/kit'
import { BorderTop, ListPropsContext, MergeContext, PassExtraListProps, Sidebar } from '@o/ui'
import React, { memo, useCallback, useContext, useEffect } from 'react'
import { useStores } from '../../hooks/useStores'
import { statusbarPadElement } from './OrbitStatusBar'
import { ToolBarPad } from './OrbitToolBar'

export const OrbitSidebar = memo((props: AppMainViewProps) => {
  const { identifier, id } = useContext(AppLoadContext)
  const { orbitStore, appStore } = useStores()
  const onSelectItem = useCallback(
    (index, appProps) => orbitStore.setSelectItem(id, index, appProps),
    [orbitStore],
  )

  useEffect(() => {
    return () => {
      console.log('shouldnt unmount', id, identifier)
    }
  }, [])

  if (!props.hasSidebar) {
    return null
  }

  return (
    <SubPane id={id} fullHeight>
      <Sidebar
        background="transparent"
        width={appStore.showSidebar ? appStore.sidebarWidth : 0}
        onResize={appStore.setSidebarWidth}
        minWidth={appStore.showSidebar ? 100 : 0}
        maxWidth={500}
        noBorder
      >
        <ToolBarPad hasToolbar={props.hasToolbar} hasSidebar />
        <Col flex={1} position="relative" overflow="hidden">
          {props.hasToolbar && <BorderTop opacity={0.5} />}
          <MergeContext
            Context={ListPropsContext}
            value={{ selectable: true, searchable: true, alwaysSelected: true }}
          >
            <PassExtraListProps onSelectItem={onSelectItem}>{props.children}</PassExtraListProps>
          </MergeContext>
        </Col>
        {props.hasStatusbar && statusbarPadElement}
      </Sidebar>
    </SubPane>
  )
})
