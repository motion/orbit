import { Templates } from '@o/kit'
import { Section, Title } from '@o/ui'
import React from 'react'

export function TestUIKitchenSink() {
  return (
    <Templates.MasterDetail items={[{ id: 'sections', title: 'Sections' }]}>
      {selected => {
        const View = views[selected.id]
        return <View />
      }}
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
