import { open } from './open'

export async function openAuth(integrationName: string) {
  open(`https://tryorbit.com/auth/${integrationName}`)
}
