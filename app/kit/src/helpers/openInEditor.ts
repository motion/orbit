import { command } from '@o/bridge'
import { EditCommand, EditCommandProps } from '@o/models'

export async function openInEditor(props: EditCommandProps) {
  return await command(EditCommand, props)
}
