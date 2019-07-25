import { resolveCommand } from '@o/mediator'
import { AppCreateWorkspaceCommand } from '@o/models'

import { findOrCreateWorkspace } from './findOrCreateWorkspace'

export const AppCreateWorkspaceResolver = resolveCommand(AppCreateWorkspaceCommand, async props => {
  await findOrCreateWorkspace(props)
  return true
})
