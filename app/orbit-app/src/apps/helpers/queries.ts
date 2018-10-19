import { IntegrationType, Bit } from '@mcro/models'
import { FindOptions } from 'typeorm'

export const findManyType = (integration: IntegrationType): FindOptions<Bit> => ({
  take: 10,
  where: {
    integration,
  },
  relations: ['people'],
  order: { bitCreatedAt: 'DESC' },
})
