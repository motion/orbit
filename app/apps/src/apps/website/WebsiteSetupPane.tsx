import { command, useModel } from '@mcro/bridge'
import { AppProps } from '@mcro/kit'
import { AppModel, AppSaveCommand } from '@mcro/models'
import { Button, Col, InputRow, Message, Table, Theme, VerticalSpace } from '@mcro/ui'
import produce from 'immer'
import React, { useEffect, useState } from 'react'

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
  const [app, update] = useModel(AppModel, { where: { id: +props.appConfig.subId } })
  const [values, setValues] = useState({ url: '' })

  useEffect(
    () => {
      setValues({ ...app.data.values })
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
    await command(AppSaveCommand, {
      app,
    })
  }

  return (
    <Col tagName="form" onSubmit={addApp} padding={20}>
      <Message>Enter website URL</Message>
      <VerticalSpace />
      <Col margin="auto" width={370}>
        <Col padding={[0, 10]}>
          <Table>
            <InputRow
              label="Website URL"
              value={values.url}
              onChange={e => {
                setValues({ ...values, url: e.target.value })
              }}
            />
          </Table>
          <VerticalSpace />
          <Theme>
            <Button type="submit" onClick={addApp}>
              Save
            </Button>
          </Theme>
          <VerticalSpace />
        </Col>
      </Col>
    </Col>
  )
}
