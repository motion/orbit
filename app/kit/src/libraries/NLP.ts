import { loadMany } from '@o/bridge'
import { Model } from '@o/mediator'
import { CosalSaliencyModel, CosalTopicsModel, CosalTopWordsModel, SearchByTopicModel } from '@o/models'

export type ModelParams<T extends Model<any, any>> = T extends Model<any, infer U> ? U : never

export class NLP {
  searchBits(args: ModelParams<typeof SearchByTopicModel>) {
    return loadMany(SearchByTopicModel, { args })
  }

  getWordWeights(args: ModelParams<typeof CosalSaliencyModel>) {
    return loadMany(CosalSaliencyModel, { args })
  }

  getMostSalientWords(args: ModelParams<typeof CosalTopWordsModel>) {
    return loadMany(CosalTopWordsModel, { args })
  }

  getTopics(args: ModelParams<typeof CosalTopicsModel>) {
    return loadMany(CosalTopicsModel, { args })
  }
}
