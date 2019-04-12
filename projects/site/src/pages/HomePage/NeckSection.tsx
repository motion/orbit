import { Col, FullScreen } from '@o/ui'
import React from 'react'
import northernlights from '../../../public/images/northern-lights.svg'
import { Page } from '../../views/Page'
import { PillButtonDark } from '../../views/PillButtonDark'
import { TitleText } from '../../views/TitleText'

export function NeckSection() {
  return (
    <Page offset={1}>
      <Page.Content>
        <Col space="md" alignItems="center" pad="xl">
          <TitleText size="xxl">Everything included.</TitleText>
          <TitleText size="lg" fontWeight={200}>
            No config, no servers + a desktop-class UI kit.
          </TitleText>
          <TitleText size="md" fontWeight={200} alpha={0.5}>
            Orbit comes with an incredibly large, flexible, and powerful toolkit out of the box.
          </TitleText>
        </Col>

        <PillButtonDark>Import</PillButtonDark>
      </Page.Content>

      <Page.Background background={theme => theme.background} />

      <Page.Parallax speed={0.1} zIndex={-2}>
        <FullScreen
          className="northern-lights"
          backgroundImage={`url(${northernlights})`}
          backgroundSize="contain"
          backgroundPosition="top left"
        />
        <FullScreen
          className="spotlight"
          zIndex={1}
          background="radial-gradient(transparent, black)"
        />
      </Page.Parallax>
    </Page>
  )
}
