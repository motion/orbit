import { loadMany } from '@o/bridge'
import { Model } from '@o/mediator'
import {
  CosalSaliencyModel,
  CosalTopicsModel,
  CosalTopWordsModel,
  SearchByTopicModel,
} from '@o/models'

type ModelParams<T extends Model<any, any>> = T extends Model<any, infer U> ? U : never

class NLPStore {
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

export const NLP = new NLPStore()
