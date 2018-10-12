import { react, view } from '@mcro/black'
import { save } from '@mcro/model-bridge'
import { Setting, SettingModel, WebsiteSetting, WebsiteSettingValues } from '@mcro/models'
import * as UI from '@mcro/ui'
import * as React from 'react'
import { WebsiteCrawledData } from '../../../../../../orbit-syncers/src/integrations/website/WebsiteCrawledData'
import { Message } from '../../../../views/Message'
import { Table, InputRow, VerticalSpace } from '../../../../views'

type Props = {
  type: string
  setting?: WebsiteSetting
}

class AtlassianSettingLoginStore {
  props: Props
  // setting: Setting

  values: WebsiteSettingValues = {
    url: '',
  }

  setting = react(
    () => this.props.setting,
    async propSetting => {
      // if setting was sent via component props then use it
      if (propSetting) {
        this.values = propSetting.values
        return propSetting
      }

      // if setting prop was not defined then at least
      // integration type should be defined to create a new setting
      if (!this.props.type) throw new Error('No props.type')

      // create a new empty setting
      return {
        category: 'integration',
        type: this.props.type,
        token: null,
      } as Setting
    },
  )
}

@view.attach({
  store: AtlassianSettingLoginStore,
})
@view
export class WebsiteSettingPane extends React.Component<
  Props & { store?: AtlassianSettingLoginStore }
> {
  // if (!values.username || !values.password || !values.domain)
  // if (values.domain.indexOf('http') !== 0)

  addIntegration = async e => {
    e.preventDefault()
    const { setting, values } = this.props.store
    setting.values = { ...setting.values, ...values }
    console.log(`adding integration!`, setting)
    await save(SettingModel, setting)
  }

  handleChange = (prop: keyof WebsiteCrawledData) => (val: WebsiteCrawledData[typeof prop]) => {
    this.props.store.values = {
      ...this.props.store.values,
      [prop]: val,
    }
  }

  render() {
    const { values } = this.props.store
    return (
      <UI.Col tagName="form" onSubmit={this.addIntegration} padding={20}>
        <Message>Enter website URL</Message>
        <VerticalSpace />
        <UI.Col margin="auto" width={370}>
          <UI.Col padding={[0, 10]}>
            <Table>
              <InputRow
                label="Website URL"
                value={values.url}
                onChange={this.handleChange('url')}
              />
            </Table>
            <VerticalSpace />
            <UI.Theme>
              <UI.Button type="submit" onClick={this.addIntegration}>
                Save
              </UI.Button>
            </UI.Theme>
            <VerticalSpace />
          </UI.Col>
        </UI.Col>
      </UI.Col>
    )
  }
}
