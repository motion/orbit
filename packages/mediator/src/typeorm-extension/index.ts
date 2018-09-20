import { Connection } from 'typeorm'
import { Model } from '../common'
import {
  resolveCount,
  ResolveInterface,
  resolveMany,
  resolveManyAndCount,
  resolveObserveCount,
  resolveObserveMany,
  resolveObserveManyAndCount,
  resolveObserveOne,
  resolveOne,
  resolveRemove,
  resolveSave,
} from '../server'

export interface TypeORMResolver<ModelType> {
  entity: Function
  models: Model<ModelType>[]
}

export function typeormResolvers(
  connection: Connection,
  entityResolvers: TypeORMResolver<any>[],
): ResolveInterface<any, any, any>[] {
  const resolvers: ResolveInterface<any, any, any>[] = []
  for (let entityResolver of entityResolvers) {
    for (let model of entityResolver.models) {
      resolvers.push(
        resolveOne(model, async args => {
          return connection.getRepository(entityResolver.entity).findOne(args)
        }),
      )
      resolvers.push(
        resolveMany(model, async args => {
          return connection.getRepository(entityResolver.entity).find(args)
        }),
      )
      resolvers.push(
        resolveManyAndCount(model, async args => {
          return connection.getRepository(entityResolver.entity).findAndCount(args)
        }),
      )
      resolvers.push(
        resolveCount(model, async args => {
          // todo: not sure but probably we would need to use args.where
          return connection.getRepository(entityResolver.entity).count(args)
        }),
      )
      resolvers.push(
        resolveSave(model, async args => {
          return connection.getRepository(entityResolver.entity).save(args)
        }),
      )
      resolvers.push(
        resolveRemove(model, async model => {
          await connection.getRepository(entityResolver.entity).remove(model)
          return true
        }),
      )
      resolvers.push(
        resolveObserveOne(model, args => {
          return connection.getRepository(entityResolver.entity).observeOne(args)
        }),
      )
      resolvers.push(
        resolveObserveMany(model, args => {
          return connection.getRepository(entityResolver.entity).observe(args)
        }),
      )
      resolvers.push(
        resolveObserveManyAndCount(model, args => {
          return connection.getRepository(entityResolver.entity).observeManyAndCount(args)
        }),
      )
      resolvers.push(
        resolveObserveCount(model, args => {
          // todo: not sure but probably we would need to use args.where
          return connection.getRepository(entityResolver.entity).observeCount(args)
        }),
      )
    }
  }
  return resolvers
}
