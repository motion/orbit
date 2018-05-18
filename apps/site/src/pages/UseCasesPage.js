import {
  Header,
  Footer,
  Border,
  SectionUseCaseRemoteTeams,
  SectionUseCaseRemoteFirst,
  SectionUseCaseReduceInterrupts,
} from './HomePage'
import * as React from 'react'
import { view } from '@mcro/black'
import { Section, SectionContent } from '~/views/section'

@view
class UseCasesIntro {
  render() {
    return (
      <Section>
        <SectionContent fullscreen padded />
      </Section>
    )
  }
}

@view
export default class UseCasesPage {
  render() {
    return (
      <React.Fragment>
        <Header />
        <UseCasesIntro />
        <surround css={{ position: 'relative' }}>
          <Border css={{ top: 0, zIndex: 1 }} />
          <SectionUseCaseRemoteTeams />
          <SectionUseCaseRemoteFirst />
          <SectionUseCaseReduceInterrupts />
        </surround>
        <Footer />
      </React.Fragment>
    )
  }
}
