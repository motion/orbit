import { AppDefinition, AppIcon, getSearchAppDefinitions, isDataDefinition, useAppDefinition, useAppDefinitionFromStore, useAppStoreInstalledAppDefinition } from '@o/kit'
import { BannerHandle, Button, ButtonProps, Divider, Loading, Message, Paragraph, Row, Section, SubSection, SubTitle, useBanner } from '@o/ui'
import React, { Suspense, useState } from 'react'

import { useInstallApp } from '../../helpers/installApp'
import { AppSetupForm } from './AppSetupForm'
import { AppsMainNew } from './AppsMainNew'

export function AppsMainAddApp(props: { identifier: string }) {
  const banner = useBanner()

  return (
    <Suspense fallback={<Loading />}>
      <AppsMainAddAppContent banner={banner} {...props} />
    </Suspense>
  )
}

function SubItem(props: ButtonProps) {
  return <Button padding={0} chromeless {...props} />
}

export function AppsMainAddAppContent({
  banner,
  identifier,
}: {
  identifier: string
  banner: BannerHandle
}) {
  // only download full definition once necessary
  const installApp = useInstallApp()
  const [shouldLoadFullDef, setShouldLoadFullDef] = useState(false)
  const localDef = useAppDefinition(identifier)
  const searchApp = getSearchAppDefinitions(!localDef && identifier)
  const simpleSearchDef = useAppDefinitionFromStore(!localDef && identifier)
  const fullSetupDef = useAppStoreInstalledAppDefinition(
    !localDef && shouldLoadFullDef && identifier,
    {
      onStatus(message: string | false) {
        if (message === false) {
          banner.close()
        } else {
          banner.set({ message })
        }
      },
    },
  )

  let error = ''
  let def: AppDefinition | null = localDef

  if (fullSetupDef && 'error' in fullSetupDef) {
    error = fullSetupDef.error
  } else if (!def) {
    if (fullSetupDef && !('error' in fullSetupDef)) {
      def = fullSetupDef
    } else {
      def = simpleSearchDef
    }
  }

  if (!def) {
    console.warn('no definition found...')
    return null
  }

  const hasSetup = !!def.setup

  return (
    <Section
      padding="lg"
      space="xxl"
      icon={<AppIcon icon={def.icon} identifier={identifier} />}
      title={def.name}
      subTitle={`Add ${def.name} app.`}
      titlePadding
      titleBorder
      afterTitle={
        <>
          {def.auth && (
            <Button alt="confirm" icon="lock" onClick={() => installApp(def!)}>
              Authenticate and add
            </Button>
          )}
          {!def.auth && !def.setup && (
            <Button alt="confirm" icon="plus" onClick={() => installApp(def!, true)}>
              Add
            </Button>
          )}
        </>
      }
      belowTitle={
        !!searchApp && (
          <Row space padding={[0, 'md', 'md']}>
            <SubItem>{searchApp.author || 'anonymous'}</SubItem>
            <SubItem icon="download">{searchApp.installs || '11,129'}</SubItem>
          </Row>
        )
      }
    >
      {!!error && <Message alt="error">{error}</Message>}

      <SubSection title="Setup" titleSize="xs" subTitle="Customize and add app to workspace" space>
        <AppsMainNew
          customizeColor={!isDataDefinition(def)}
          app={{ target: 'app', name: def.name, identifier: def.id }}
        />

        {hasSetup && (
          <>
            <Divider />
            <AppSetupForm
              onFocus={() => {
                setShouldLoadFullDef(true)
              }}
              def={def}
            />
          </>
        )}
      </SubSection>

      {hasSetup && (
        <Message alt="lightGray" icon="warn">
          This app stores data privately, only on your device. If your team enables decentralized
          key-sharing, it syncs private keys securely, <strong>only directly</strong> to others
          users in this space.
        </Message>
      )}

      <Section space>
        <SubTitle>Description</SubTitle>

        {`${def.description || ''}`.split('\n').map((par, index) => (
          <Paragraph key={index}>{par}</Paragraph>
        ))}
      </Section>
    </Section>
  )
}
