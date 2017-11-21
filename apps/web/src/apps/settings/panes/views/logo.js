import * as React from 'react'
import { view } from '@mcro/black'
import { capitalize } from 'lodash'

@view
export default class Logo {
  renderGithub() {
    return (
      <img
        css={{ marginLeft: -5, marginTop: -4, height: 'auto', width: 80 }}
        src="/images/github-logo.png"
      />
    )
  }

  renderSlack() {
    return (
      <img
        css={{
          height: 'auto',
          width: 80,
        }}
        src="/images/slack-logo.png"
      />
    )
  }
  renderDrive() {
    return (
      <drive $$row css={{ alignItems: 'center' }}>
        <img
          css={{ width: 80, height: 80 / 3.03 }}
          src="/images/google-logo.png"
        />
        <text
          css={{
            marginLeft: 10,
            marginTop: 3,
            color: '#dd4b39',
            fontSize: 16,
          }}
        >
          Drive
        </text>
      </drive>
    )
  }

  renderCalendar() {
    return (
      <cal $$row css={{ alignItems: 'center' }}>
        <img
          css={{ width: 80, height: 80 / 3.03 }}
          src="/images/google-logo.png"
        />
        {/* font from calendar.google.com */}
        <calendar
          css={{
            marginLeft: 10,
            marginTop: 3,
            color: '#dd4b39',
            fontSize: 16,
          }}
        >
          Calendar
        </calendar>
      </cal>
    )
  }

  render({ service }) {
    return this['render' + capitalize(service)]()
  }
}
