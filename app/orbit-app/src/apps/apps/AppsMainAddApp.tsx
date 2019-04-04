import { AppView, getAppDefinition } from '@o/kit'
import { Button, ButtonProps, Paragraph, Row, Section, Space, SubTitle } from '@o/ui'
import React from 'react'
import { addAppClickHandler } from '../../helpers/addAppClickHandler'
import { SubSection } from '../../views/SubSection'

export function AppsMainAddApp(props: { identifier: string }) {
  const def = getAppDefinition(props.identifier)
  const hasSetup = !!def.setup

  return (
    <Section
      titleBorder
      title={def.name}
      icon={props.identifier}
      padded
      afterTitle={
        <>
          {!hasSetup && def.sync && (
            <Button alt="confirm" icon="lock" onClick={addAppClickHandler(def)}>
              Authenticate and add
            </Button>
          )}
          {!def.sync && (
            <Button alt="action" icon="add">
              Install
            </Button>
          )}
        </>
      }
      belowTitle={
        <Row padding={[10, 0]}>
          <SubTitle margin={0}>
            <SubItem>{def['author'] || 'anonymous'}</SubItem>
            <SubItem icon="download">{def['downloads'] || '11,129'}</SubItem>
          </SubTitle>
        </Row>
      }
    >
      {hasSetup && (
        <>
          <SubSection title="Setup">
            <AppView identifier={props.identifier} viewType="setup" />
          </SubSection>
          <Space />
        </>
      )}
      <SubSection title="Description">
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
      </SubSection>
    </Section>
  )
}

function SubItem(props: ButtonProps) {
  return <Button chromeless fontWeight={500} {...props} />
}
