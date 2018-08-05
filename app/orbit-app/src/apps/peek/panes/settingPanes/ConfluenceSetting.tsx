import * as React from 'react'
import { view, compose } from '@mcro/black'
// import * as UI from '@mcro/ui'
// import { OrbitIcon } from '../../../../views/OrbitIcon'
// import { SubTitle } from '../../../../views'
import { AtlassianSettingLogin } from './AtlassianSettingLogin'
import { SettingPaneProps } from './SettingPaneProps'

class ConfluenceSettingStore {
  active = 'general'
}

// const Section = view({
//   flex: 1,
// })

const decorator = compose(
  view.attach({
    store: ConfluenceSettingStore,
  }),
  view,
)

type Props = SettingPaneProps & { store: ConfluenceSettingStore }

export const ConfluenceSetting = decorator(({ setting, children }: Props) => {
  return children({
    content: <AtlassianSettingLogin type="confluence" setting={setting} />,
  })
  // return children({
  //   belowHead: (
  //     <UI.Tabs
  //       $tabs
  //       active={store.active}
  //       onActive={key => (store.active = key)}
  //     >
  //       <UI.Tab key="general" width="50%" label="General" />
  //       <UI.Tab key="account" width="50%" label="Account" />
  //     </UI.Tabs>
  //   ),
  //   content: (
  //     <UI.Col flex={1}>
  //       <Section if={store.active === 'general'}>
  //         <UI.Col margin="auto">
  //           <SubTitle css={{ textAlign: 'center' }}>All good!</SubTitle>
  //           <OrbitIcon icon="confluence" size={256} />
  //         </UI.Col>
  //       </Section>
  //       <Section if={store.active === 'account'}>
  //         <AtlassianSettingLogin setting={setting} />
  //       </Section>
  //     </UI.Col>
  //   ),
  // })
})
