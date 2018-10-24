import * as React from 'react'
import { FormRow } from '../../views'
import { Input } from '../../views/Input'
import { Theme, Button, Col, View } from '@mcro/ui'
import { BottomControls } from '../../views/BottomControls'

export class AppListSetup extends React.Component {
  render() {
    return (
      <View padding={10}>
        <FormRow label="Name">
          <Input />
        </FormRow>

        <BottomControls>
          <Col flex={1} />
          <Theme name="orbit">
            <Button>Create</Button>
          </Theme>
        </BottomControls>
      </View>
    )
  }
}
