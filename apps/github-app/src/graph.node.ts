import { AppBit } from '@o/kit'

export async function graph(app: AppBit) {
  return {
    remoteHttpLink: {
      uri: 'https://api.github.com/graphql',
      fetch,
      headers: {
        Authorization: `bearer ${app.token}`,
      },
    },
  }
}
