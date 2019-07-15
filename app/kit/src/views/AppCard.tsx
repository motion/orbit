import { AppBit, AppDefinition } from '@o/models'
import { Button, Card, CardProps, Loading, Row, useFocusableItem } from '@o/ui'
import { isDefined } from '@o/utils'
import React, { Suspense, useEffect, useRef, useState } from 'react'

import { UnPromisifiedObject, useApp } from '../hooks/useApp'
import { SelectApp } from './SelectApp'

type AppCardProps<Def extends AppDefinition> = Omit<CardProps, 'children' | 'onChange'> & {
  children: (props: {
    api: UnPromisifiedObject<Def['api'] extends Function ? ReturnType<Def['api']> : null>
  }) => React.ReactNode
  app?: AppBit
  appType: Def
  onChange?: (app: AppBit) => any
}

export function AppCard<A extends AppDefinition>({
  appType,
  children,
  onChange,
  app,
  ...cardProps
}: AppCardProps<A>) {
  const [internalApp, setApp] = useState<AppBit>(null)
  const isFocused = useFocusableItem(
    useRef(`appcard-${Math.floor(Math.random() * 100000)}`).current,
  )

  useEffect(() => {
    onChange && onChange(internalApp)
  }, [internalApp])

  return (
    <Card
      key="slack"
      afterTitle={
        !isDefined(app) && (
          <Row space="sm" minWidth={200}>
            <SelectApp appType={appType} onSelect={setApp} />
            <Button chromeless icon="cross" />
          </Row>
        )
      }
      title="Slack Messages"
      flex={1}
      elevation={2}
      focus={isFocused}
      {...cardProps}
    >
      <Suspense fallback={<Loading />}>
        <AppCardInner appType={appType} app={app || internalApp}>
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
