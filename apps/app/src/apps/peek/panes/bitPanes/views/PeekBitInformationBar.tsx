import { PeekBitInformation } from './peek/PeekContents/PeekBitInformation'
import { Bit, Person } from '@mcro/models'

export const PeekBitInformationBar = ({ bit }) => {
  return (
    <PeekBitInformation
      if={peekStore.model instanceof Bit || peekStore.model instanceof Person}
      body={
        peekStore.model.body ||
        'ui kit size prop async migration freelance distrbiution org integration'
      }
      people={peekStore.model.people}
    />
  )
}

// import * as React from 'react'
// import { view } from '@mcro/black'
// import keywordExtract from 'keyword-extractor'
// import * as UI from '@mcro/ui'
// import { SubTitle, RoundButton } from '../../../views'
// import { PeekSection } from './PeekViews'
// import { Person } from '@mcro/models'
// import { RoundButtonPerson } from '../../../views/RoundButtonPerson'

// const options = {
//   language: 'english',
//   remove_digits: true,
//   return_changed_case: true,
//   remove_duplicates: false,
// }

// type Props = {
//   body: string
//   people: Person[]
// }

// export const PeekBitInformation = view(({ body, people }: Props) => {
//   const keywords = keywordExtract.extract(body, options).slice(0, 8)
//   return (
//     <PeekSection backgroundColor="#fff" borderTop={[1, '#e8e8e8']}>
//       <UI.Row alignItems="center">
//         <SubTitle verticalSpacing={0}>Topics</SubTitle>
//         <UI.Block width={20} />
//         {keywords.map((word, i) => <RoundButton key={i}>{word}</RoundButton>)}
//       </UI.Row>
//       <UI.Row if={people && people.length} marginTop={10} alignItems="center">
//         <SubTitle verticalSpacing={0}>People</SubTitle>
//         <UI.Block width={20} />
//         {people.map((person, i) => (
//           <RoundButtonPerson person={person} key={i} />
//         ))}
//       </UI.Row>
//     </PeekSection>
//   )
// })
