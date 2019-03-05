import { AppView, getAppDefinition, Icon } from '@mcro/kit'
import { Button, ButtonProps, Paragraph, Row, Section, SubTitle, Theme } from '@mcro/ui'
import React from 'react'
import { addAppClickHandler } from '../../helpers/addAppClickHandler'
import { SubSection } from '../../views/SubSection'
import { TitleRow } from '../../views/TitleRow'

export function AppsMainAddApp(props: { identifier: string }) {
  const def = getAppDefinition(props.identifier)
  const hasSetup = !!def.setup

  return (
    <Section>
      <TitleRow
        bordered
        before={<Icon name={props.identifier} size={24} />}
        after={
          <>
            {!hasSetup && def.sync && (
              <Theme name="action">
                <Button icon="lock" onClick={addAppClickHandler(def)}>
                  Authenticate and add
                </Button>
              </Theme>
            )}
            {!def.sync && (
              <Theme name="selected">
                <Button icon="add">Install</Button>
              </Theme>
            )}
          </>
        }
      >
        {def.name}
      </TitleRow>
      <SubTitle>
        <Row>
          <SubItem>{def['author'] || 'anonymous'}</SubItem>
          <SubItem icon="download">{def['downloads'] || '11,129'}</SubItem>
        </Row>
      </SubTitle>

      {hasSetup && (
        <SubSection title="Setup">
          <AppView identifier={props.identifier} viewType="setup" />
        </SubSection>
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
