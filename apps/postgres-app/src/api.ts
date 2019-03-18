import { CallAppBitApiMethodCommand, command } from '@o/kit'

export default {
  query: (appId: number, query: string, parameters: any[] = []) => {
    return command(CallAppBitApiMethodCommand, {
      appId,
      appIdentifier: "postgres",
      method: "query",
      args: [query, parameters]
    })
  }
}
