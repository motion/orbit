import { AppBit } from '@o/models'
import { Button, Card, CardProps, Loading, SpaceGroup, useFocusableItem } from '@o/ui'
import React, { Suspense, useRef, useState } from 'react'

import { UnPromisifiedObject, useApp } from '../hooks/useApp'
import { Omit } from '../types'
import { AppDefinition } from '../types/AppDefinition'
import { SelectApp } from './SelectApp'

type AppCardProps<Def extends AppDefinition> = Omit<CardProps, 'children'> & {
  children: (props: { api: UnPromisifiedObject<ReturnType<Def['api']>> }) => React.ReactNode
  appType: Def
}

export function AppCard<A extends AppDefinition>({
  appType,
  children,
  ...cardProps
}: AppCardProps<A>) {
  const [app, setApp] = useState<AppBit>(null)
  const isFocused = useFocusableItem(useRef(`appcard-${Math.random()}`).current)
  return (
    <Card
      key="slack"
      afterTitle={
        <SpaceGroup space="sm">
          <SelectApp appType={appType} onSelect={setApp} />
          <Button chromeless icon="cross" />
        </SpaceGroup>
      }
      title="Slack Messages"
      flex={1}
      elevation={2}
      focus={isFocused}
      {...cardProps}
    >
      <Suspense fallback={<Loading />}>
        <AppCardInner appType={appType} app={app}>
          {children}
        </AppCardInner>
      </Suspense>
    </Card>
  )
}

function AppCardInner(props: { appType: AppDefinition; app: AppBit; children: any }) {
  const api = useApp(props.appType, props.app)
  return props.app && props.children({ api })
}
