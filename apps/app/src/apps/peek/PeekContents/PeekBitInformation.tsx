import * as React from 'react'
import { view } from '@mcro/black'
import keywordExtract from 'keyword-extractor'
import * as UI from '@mcro/ui'
import { SmallLink, SubTitle } from '../../../views'
import { PeekSection } from './PeekViews'

const options = {
  language: 'english',
  remove_digits: true,
  return_changed_case: true,
  remove_duplicates: false,
}

export const PeekBitInformation = view(({ bit }) => {
  const keywords = keywordExtract.extract(bit.body, options).slice(0, 8)

  return (
    <PeekSection>
      <SubTitle>Topics</SubTitle>
      <UI.Text size={1.3} sizeLineHeight={0.9}>
        {keywords.map((word, i) => (
          <React.Fragment key={i}>
            <SmallLink>{word}</SmallLink>{' '}
          </React.Fragment>
        ))}
      </UI.Text>
    </PeekSection>
  )
})
