import * as React from 'react'
import { FormRow } from '../../views'
import { Input } from '../../views/Input'
import { View } from '@mcro/ui'

export class AppListSetup extends React.Component {
  render() {
    return (
      <View padding={10}>
        <FormRow label="Name">
          <Input />
        </FormRow>
      </View>
    )
  }
}
