import { useAppDefinition } from '@o/kit'
import { Button, ButtonProps, Message, Paragraph, Row, Section, SubTitle } from '@o/ui'
import React from 'react'

import { addAppClickHandler } from '../../helpers/addAppClickHandler'
import { AppSetupForm } from './AppSetupForm'

export function AppsMainAddApp(props: { identifier: string }) {
  const def = useAppDefinition(props.identifier)
  const hasSetup = !!def.setup

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
            This app stores data. This data will be stored privately, only on your device. If your
            team enables decentralized key-sharing, it will sync <strong>directly</strong> to
            authorized users in this space.
          </Message>
        </Section>
      )}

      <Section space>
        <SubTitle>Description</SubTitle>

        <Paragraph>
          Features Fuzzy-matching autocomplete to create new file relative to existing path Create
          new directories while creating a new file Create a directory instead of a file by
          suffixing the file path with / as in somedirectory/ to create the directory (thanks to
          maximilianschmitt).
        </Paragraph>

        <Paragraph>
          Ignores gitignored and workspace files.exclude settings. Additional option of adding
          advancedNewFile.exclude settings to workspace settings just like native files.exlude
          except it explicitly effects AdvancedNewFile plugin only. (thanks to Kaffiend) Control the
          order of top convenient options ("last selection", "current file", etc) via config setting
          advancedNewFile.convenienceOptions Configuration Example Command palette: "Advanced New
          File" Keyboard shortcut: cmd+alt+n (Mac), ctrl+alt+n (Win, Linux) Keybindings You can add
          your own keybinding in your keybindings.json
        </Paragraph>
      </Section>
    </Section>
  )
}

function SubItem(props: ButtonProps) {
  return <Button chromeless {...props} />
}
