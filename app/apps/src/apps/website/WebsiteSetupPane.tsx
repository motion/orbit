import { command } from '@mcro/bridge'
import { AppSettingsProps } from '@mcro/kit'
import { AppBit, AppSaveCommand, WebsiteApp } from '@mcro/models'
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

type Props = AppSettingsProps<WebsiteApp>

class WebsiteSetupStore {
  props: Props
  // app: App

  values: WebsiteApp['data']['values'] = {
    url: '',
  }

  app = react(
    () => this.props.app,
    async propApp => {
      // if app was sent via component props then use it
      if (propApp) {
        this.values = propApp.data.values
        return propApp
      }
      // create a new empty app
      return {
        identifier: 'website',
        // TODO
        // token: null,
        // category: 'app',
      } as AppBit
    },
  )
}

export default function WebsiteSetupPane(props: Props) {
  const store = useStore(WebsiteSetupStore, props)

  const addApp = React.useCallback(
    async e => {
      e.preventDefault()
      const { app, values } = store
      app.data.values = { ...app.data.values, ...values }
      app.name = values.url
      console.log(`adding app!`, app)
      const result = await command(AppSaveCommand, {
        app,
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
    <UI.Col tagName="form" onSubmit={addApp} padding={20}>
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
            <UI.Button type="submit" onClick={addApp}>
              Save
            </UI.Button>
          </UI.Theme>
          <VerticalSpace />
        </UI.Col>
      </UI.Col>
    </UI.Col>
  )
}
