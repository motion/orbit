import { command } from '@mcro/bridge'
import { Source, SourceSaveCommand, WebsiteSource, WebsiteSourceValues } from '@mcro/models'
import * as UI from '@mcro/ui'
import { InputRow, Message, Table, VerticalSpace } from '@mcro/ui'
import { react, useStore } from '@mcro/use-store'
import * as React from 'react'

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

export default function WebsiteSetupPane(props: Props) {
  const store = useStore(WebsiteSetupStore, props)

  const addIntegration = React.useCallback(
    async e => {
      e.preventDefault()
      const { source, values } = store
      source.values = { ...source.values, ...values }
      source.name = values.url
      console.log(`adding integration!`, source)
      const result = await command(SourceSaveCommand, {
        source,
      })

      // update status on success of fail
      if (result.success) {
        // store.status = Statuses.SUCCESS
        // store.error = null
        // Actions.clearPeek()
      } else {
        // store.status = Statuses.FAIL
        // store.error = result.error
      }
    },
    [store],
  )

  const handleChange = React.useCallback(
    (prop: keyof WebsiteCrawledData) => (val: WebsiteCrawledData[typeof prop]) => {
      store.values = {
        ...store.values,
        [prop]: val,
      }
    },
    [store],
  )

  return (
    <UI.Col tagName="form" onSubmit={addIntegration} padding={20}>
      <Message>Enter website URL</Message>
      <VerticalSpace />
      <UI.Col margin="auto" width={370}>
        <UI.Col padding={[0, 10]}>
          <Table>
            <InputRow
              label="Website URL"
              value={store.values.url}
              // !TODO type on handlechange
              onChange={handleChange('url') as any}
            />
          </Table>
          <VerticalSpace />
          <UI.Theme>
            <UI.Button type="submit" onClick={addIntegration}>
              Save
            </UI.Button>
          </UI.Theme>
          <VerticalSpace />
        </UI.Col>
      </UI.Col>
    </UI.Col>
  )
}
