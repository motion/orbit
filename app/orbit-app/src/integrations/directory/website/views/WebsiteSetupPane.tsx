import { react, view, attach } from '@mcro/black'
import { command } from '@mcro/model-bridge'
import { Source, SourceSaveCommand, WebsiteSource, WebsiteSourceValues } from '@mcro/models'
import * as UI from '@mcro/ui'
import * as React from 'react'
import { InputRow, Table, VerticalSpace } from '../../../../views'
import { Message } from '../../../../views/Message'

/**
 * Crawled website data.
 * Used to create a bit from.
 */
export interface WebsiteCrawledData {
  url: string
  title: string
  textContent: string
  content: string
}

type Props = {
  source?: WebsiteSource
}

class WebsiteSetupStore {
  props: Props
  // source: Source

  values: WebsiteSourceValues = {
    url: '',
  }

  source = react(
    () => this.props.source,
    async propSource => {
      // if source was sent via component props then use it
      if (propSource) {
        this.values = propSource.values
        return propSource
      }
      // create a new empty source
      return {
        category: 'integration',
        type: 'website',
        token: null,
      } as Source
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
    const { source, values } = this.props.store
    source.values = { ...source.values, ...values }
    source.name = values.url
    console.log(`adding integration!`, source)
    const result = await command(SourceSaveCommand, {
      source,
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
