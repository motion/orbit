import { command } from '@o/bridge'
import { EditCommand, EditCommandProps } from '@o/models'

export function openInEditor(props: EditCommandProps) {
  command(EditCommand, props)
}
