import { useObserveOne } from '@mcro/model-bridge'
import { IntegrationType, SourceModel } from '@mcro/models'
import * as React from 'react'
import { AppProps } from '../AppProps'
import SettingsAppSpaceMain from '../settings/SettingsAppSpaceMain'
import { ManageApps } from './ManageApps'

export const SourcesAppMain = (props: AppProps<any>) => {
  const source = useObserveOne(
    SourceModel,
    props.appConfig &&
      props.appConfig.viewType !== 'setup' && {
        where: { id: +props.appConfig.id },
      },
  )

  if (!props.appConfig) {
    return <div>no item selected</div>
  }

  if (props.appConfig.subType === 'manage-apps') {
    return <ManageApps />
  }

  if (props.appConfig.subType === 'manage-space') {
    return <SettingsAppSpaceMain {...props} />
  }

  const type = props.appConfig.integration as IntegrationType
  const View = props.sourcesStore.getView(type, 'setting')

  if (!View) {
    console.log(props.appConfig)
    return (
      <div>
        no view type {type}, for source <br />
      </div>
    )
  }

  return <View source={source} appConfig={props.appConfig} />
}
