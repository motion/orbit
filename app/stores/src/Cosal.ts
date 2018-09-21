import { proxy } from './proxy'

@proxy
export class CosalStore {
  getTopWords: (words: string[], amt: number) => string
}
