import { API_URL } from '../../constants'
import { open } from './open'

export async function openAuth(integrationName: string) {
  open(`${API_URL}/auth/${integrationName}`)
}
