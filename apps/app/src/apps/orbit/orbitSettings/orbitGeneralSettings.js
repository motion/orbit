import { view } from '@mcro/black'
import { OrbitCard } from '../orbitCard'
import { SubTitle } from '~/views'
import * as UI from '@mcro/ui'
import { Setting } from '@mcro/models'
import { modelQueryReaction } from '@mcro/helpers'

const Row = view('section', {
  flexFlow: 'row',
  padding: [8, 0],
  alignItems: 'center',
})

const InputRow = ({ label }) => (
  <Row>
    <label css={{ padding: [0, 4], fontWeight: 400 }}>{label}</label>
    <input css={{ fontSize: 14, padding: [4, 6], margin: ['auto', 8] }} />{' '}
  </Row>
)

const CheckBoxRow = ({
  name = `checkbox-${Math.random()}`,
  children,
  checked,
  onChange,
}) => (
  <Row>
    <input
      id={name}
      name={name}
      checked={checked}
      onChange={onChange && (e => onChange(e.target.checked))}
      css={{ margin: ['auto', 4] }}
      type="checkbox"
    />{' '}
    <label htmlFor={name} css={{ padding: [0, 4], fontWeight: 400 }}>
      {children}
    </label>
  </Row>
)

class OrbitGeneralSettingsStore {
  generalSetting = modelQueryReaction(
    () =>
      Setting.findOne({
        where: { type: 'setting', category: 'general' },
      }),
    {
      condition: () => this.props.settingsStore.isPaneActive,
    },
  )

  handleChange = prop => val => {
    console.log('handleChange', prop, val)
    this.generalSetting.values[prop] = val
    this.generalSetting.save()
  }
}

@view({
  store: OrbitGeneralSettingsStore,
})
export class OrbitGeneralSettings {
  render({ store, settingsStore }) {
    const { integrationSettings } = settingsStore
    const { generalSetting } = store
    if (!generalSetting) {
      return null
    }
    console.log('generalSetting', generalSetting)
    return (
      <>
        <SubTitle>Settings</SubTitle>
        <OrbitCard>
          <UI.Text css={{ marginBottom: 10 }}>
            You've added {integrationSettings.length} integration{integrationSettings.length ===
            '1'
              ? ''
              : 's'}.{' '}
            {integrationSettings.length === 0
              ? 'Add some integrations below to get started with Orbit.'
              : ''}
          </UI.Text>
          <CheckBoxRow
            checked={generalSetting.values.autoLaunch}
            onChange={store.handleChange('autoLaunch')}
          >
            Start on Login
          </CheckBoxRow>
          <CheckBoxRow if={false} defaultChecked>
            Automatically manage disk space
          </CheckBoxRow>
          <InputRow label="Open shortcut" />
        </OrbitCard>
      </>
    )
  }
}
