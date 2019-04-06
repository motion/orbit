import { Templates } from '@o/kit'
import { Section, Title } from '@o/ui'
import React, { createElement } from 'react'

export function TestUIKitchenSink() {
  return (
    <Templates.MasterDetail
      items={[
        { id: 'sections', title: 'Sections', group: 'Layout' },
        { id: 'sections2', title: 'Sections' },
        { id: 'sections3', title: 'Sections' },
        { id: 'sections4', title: 'Sections' },
        { id: 'sections5', title: 'Sections' },
        { id: 'sections', title: 'Sections' },
        { id: 'sections', title: 'Sections' },
        { id: 'sections', title: 'Sections' },
        { id: 'sections', title: 'Sections' },
        { id: 'sections', title: 'Sections' },
        { id: 'sections', title: 'Sections' },
        { id: 'sections', title: 'Sections' },
        { id: 'sections', title: 'Sections' },
        { id: 'sections', title: 'Sections' },
        { id: 'sections', title: 'Sections' },
      ]}
    >
      {selected => (views[selected.id] ? createElement(views[selected.id]) : null)}
    </Templates.MasterDetail>
  )
}

const views = {
  sections: UISections,
}

function UISections() {
  return (
    <Section pad bordered title="hi" subTitle="hello">
      <Title>hello</Title>
    </Section>
  )
}
