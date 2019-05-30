import { useAppDefinition, useAppDefinitionFromStore } from '@o/kit'
import { Button, ButtonProps, Message, Paragraph, Row, Section, SubTitle } from '@o/ui'
import React from 'react'

import { addAppClickHandler } from '../../helpers/addAppClickHandler'
import { AppSetupForm } from './AppSetupForm'

export function AppsMainAddApp(props: { identifier: string }) {
  const def = useAppDefinition(props.identifier) || useAppDefinitionFromStore(props.identifier)
  const hasSetup = !!def.setup
  console.log('def', def)
  return (
    <Section
      pad="lg"
      space
      icon={props.identifier}
      title={def.name}
      titlePad
      titleBorder
      afterTitle={
        <>
          {!hasSetup && def.sync && (
            <Button alt="confirm" icon="lock" onClick={addAppClickHandler(def)}>
              Authenticate and add
            </Button>
          )}
          {!def.sync && !def.setup && (
            <Button alt="confirm" icon="plus" iconAfter>
              Install
            </Button>
          )}
        </>
      }
      belowTitle={
        <Row space>
          <SubItem>{def['author'] || 'anonymous'}</SubItem>
          <SubItem icon="download">{def['downloads'] || '11,129'}</SubItem>
        </Row>
      }
    >
      {hasSetup && (
        <Section space>
          <Section bordered pad title="Setup" titleSize={0.85}>
            <AppSetupForm def={def} />
          </Section>
          <Message alt="lightGray" icon="warn">
            This app stores data privately, only on your device. If your team enables decentralized
            key-sharing, it syncs private keys securely, <strong>only directly</strong> to others
            users in this space.
          </Message>
        </Section>
      )}

      <Section space>
        <SubTitle>Description</SubTitle>

        {`${def.fullDescription || def.description || ''}`.split('\n').map((par, index) => (
          <Paragraph key={index}>{par}</Paragraph>
        ))}
      </Section>
    </Section>
  )
}

function SubItem(props: ButtonProps) {
  return <Button chromeless {...props} />
}
