import { AppBit } from '@o/kit'
import postgraphile from 'postgraphile'

export async function graph(app: AppBit<PostgresAppData>) {
  return postgraphile(app.data)
}
