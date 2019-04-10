import { AppBit } from '@o/models'
import { Card, CardProps, Loading } from '@o/ui'
import React, { Suspense, useState } from 'react'
import { UnPromisifiedObject, useApp } from '../hooks/useApp'
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
  const api = useApp(appType, app)
  return (
    <Card
      key="slack"
      afterTitle={<SelectApp appType={appType} onSelect={setApp} />}
      title="Slack Messages"
      flex={1}
      elevation={2}
      {...cardProps}
    >
      <Suspense fallback={<Loading />}>{app && children({ api })}</Suspense>
    </Card>
  )
}
