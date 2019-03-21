import { AppModel, AppProps, save, useModel } from '@o/kit'
import { Button, Col, InputField, Message, Space, Table, Theme } from '@o/ui'
import produce from 'immer'
import React, { useEffect, useState } from 'react'
import { WebsiteAppData } from './WebsiteModels'

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

type Props = AppProps

export default function WebsiteSetupPane(props: Props) {
  const [app, update] = useModel(AppModel, { where: { id: +props.subId } })
  const [values, setValues] = useState({ url: '' })

  useEffect(
    () => {
      if (app) {
        setValues({ ...app.data.values })
      }
    },
    [app],
  )

  const addApp = async e => {
    e.preventDefault()
    update(
      produce(app, next => {
        next.data.values = { ...app.data.values, ...values }
      }),
    )

    // save app
    app.name = (app.data as WebsiteAppData).values.url
    await save(AppModel, app)
  }

  return (
    <Col tagName="form" onSubmit={addApp} padding={20}>
      <Message>Enter website URL</Message>
      <Space />
      <Col margin="auto" width={370}>
        <Col padding={[0, 10]}>
          <Table>
            <InputField
              label="Website URL"
              value={values.url}
              onChange={e => {
                setValues({ ...values, url: e.target.value })
              }}
            />
          </Table>
          <Space />
          <Theme>
            <Button type="submit" onClick={addApp}>
              Save
            </Button>
          </Theme>
          <Space />
        </Col>
      </Col>
    </Col>
  )
}
