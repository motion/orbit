import { command } from '@o/bridge'
import { CallAppBitApiMethodCommand } from '@o/models'

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
