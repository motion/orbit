import { react, view, attach } from '@mcro/black'
import { command } from '@mcro/model-bridge'
import { Setting, SettingSaveCommand, WebsiteSetting, WebsiteSettingValues } from '@mcro/models'
import * as UI from '@mcro/ui'
import * as React from 'react'
import { WebsiteCrawledData } from '../../../../../../orbit-syncers/src/integrations/website/WebsiteCrawledData'
import { InputRow, Table, VerticalSpace } from '../../../../views'
import { Message } from '../../../../views/Message'

type Props = {
  setting?: WebsiteSetting
}

class WebsiteSetupStore {
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
      // create a new empty setting
      return {
        category: 'integration',
        type: 'website',
        token: null,
      } as Setting
    },
  )
}

@attach({
  store: WebsiteSetupStore,
})
@view
export class WebsiteSetupPane extends React.Component<Props & { store?: WebsiteSetupStore }> {
  // if (!values.username || !values.password || !values.domain)
  // if (values.domain.indexOf('http') !== 0)

  addIntegration = async e => {
    e.preventDefault()
    const { setting, values } = this.props.store
    setting.values = { ...setting.values, ...values }
    setting.name = values.url
    console.log(`adding integration!`, setting)
    const result = await command(SettingSaveCommand, {
      setting,
    })

    // update status on success of fail
    if (result.success) {
      // this.props.store.status = Statuses.SUCCESS
      // this.props.store.error = null
      // Actions.clearPeek()
    } else {
      // this.props.store.status = Statuses.FAIL
      // this.props.store.error = result.error
    }
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
