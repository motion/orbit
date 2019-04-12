import { ButtonProps, Col, SizedSurface } from '@o/ui'
import React from 'react'
import { Page } from '../../views/Page'
import { TitleText } from '../../views/TitleText'

export function NeckSection() {
  return (
    <>
      <Page offset={0}>
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

        <Page.Parallax speed={-0.4} zIndex={-2}>
          {/* ok */}
        </Page.Parallax>
      </Page>
    </>
  )
}

function PillButtonDark({ children, ...props }: ButtonProps) {
  return (
    <SizedSurface
      sizeRadius={100}
      background="#111"
      fontWeight={800}
      letterSpacing={3}
      textTransform="uppercase"
      width="min-content"
      padding={[3, 10]}
      margin={[0, 'auto']}
      {...props}
    >
      <span
        className="clip-text"
        style={{
          background: 'linear-gradient(to left, #B74E42, #BE0FAD)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
        }}
      >
        {children}
      </span>
    </SizedSurface>
  )
}
