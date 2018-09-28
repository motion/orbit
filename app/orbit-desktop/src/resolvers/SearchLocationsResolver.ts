import { resolveMany } from '@mcro/mediator'
import { SearchLocationsModel } from '@mcro/models'
import { getSearchQuery } from './getSearchQuery'
import { getRepository } from 'typeorm'
import { BitEntity } from '@mcro/entities'

// TODO: DISTINCT() query

export const SearchLocationsResolver = resolveMany(
  SearchLocationsModel,
  async ({ query, count }) => {
    const searchQuery = getSearchQuery(query)
    const results = await getRepository(BitEntity).find(searchQuery)
    return [...new Set(results.map(x => `${x.location.name}`))].slice(0, count)
  },
)
