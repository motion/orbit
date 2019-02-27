import { getAppDefinition } from '@mcro/kit'
import { Button, ButtonProps, Row, Section, SubTitle, Theme } from '@mcro/ui'
import React from 'react'
import { SubSection } from '../../views/SubSection'
import { TitleRow } from '../../views/TitleRow'

export function AppsMainAddApp(props: { identifier: string }) {
  const def = getAppDefinition(props.identifier)

  return (
    <Section>
      <TitleRow
        bordered
        after={
          <Theme name="selected">
            <Button icon="add">Install</Button>
          </Theme>
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

      <SubSection title="Description">
        Features Fuzzy-matching autocomplete to create new file relative to existing path Create new
        directories while creating a new file Create a directory instead of a file by suffixing the
        file path with / as in somedirectory/ to create the directory (thanks to maximilianschmitt)
        Ignores gitignored and workspace files.exclude settings. Additional option of adding
        advancedNewFile.exclude settings to workspace settings just like native files.exlude except
        it explicitly effects AdvancedNewFile plugin only. (thanks to Kaffiend) Control the order of
        top convenient options ("last selection", "current file", etc) via config setting
        advancedNewFile.convenienceOptions Configuration Example Command palette: "Advanced New
        File" Keyboard shortcut: cmd+alt+n (Mac), ctrl+alt+n (Win, Linux) Keybindings You can add
        your own keybinding in your keybindings.json
      </SubSection>
    </Section>
  )
}

function SubItem(props: ButtonProps) {
  return <Button chromeless {...props} />
}
