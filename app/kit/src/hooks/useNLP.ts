import { CosalTopicsModel } from '@o/models'
import { useEffect, useState } from 'react'

import { ModelParams, NLP } from '../libraries/NLP'

export function useNLPTopics(args: ModelParams<typeof CosalTopicsModel>): string[] {
  const [state, setState] = useState<string[]>([])

  useEffect(() => {
    let off = false
    const nlpStore = new NLP()
    nlpStore.getTopics(args).then(x => {
      !off && setState(x)
    })
    return () => {
      off = true
    }
  }, [JSON.stringify(args)])

  return state
}
