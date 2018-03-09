import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view
export default class OrbitSettings {
  render() {
    return (
      <settings css={{ padding: [0, 10] }}>
        <UI.Title fontWeight={600}>Sources</UI.Title>
        <content css={{ padding: [10, 0] }}>
          <item
            css={{
              flexFlow: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <UI.Title size={1.5}>Paul Graham</UI.Title>
            <UI.Toggle />
          </item>
        </content>
      </settings>
    )
  }
}
