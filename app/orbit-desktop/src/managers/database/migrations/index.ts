import { ensureConfig } from './01-ensure-config'
import { resetDbIfOld } from './02-reset-db-if-old'

export const migrations = [{ ensureConfig }, { resetDbIfOld }]
