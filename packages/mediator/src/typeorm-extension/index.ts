import { Connection } from 'typeorm'
import { Model } from '../common'
import { ResolveInterface, resolveMany, resolveOne, resolveRemove, resolveSave } from '../server'

export interface TypeORMResolver<ModelType> {
  entity: Function;
  models: Model<ModelType>[];
}

export function typeormResolvers(connection: Connection, entityResolvers: TypeORMResolver<any>[]): ResolveInterface<any, any, any>[] {
  const resolvers: ResolveInterface<any, any, any>[] = [];
  for (let entityResolver of entityResolvers) {
    for (let model of entityResolver.models) {

      resolvers.push(resolveOne(model, async args => {
        return connection.getRepository(entityResolver.entity).findOne(args);
      }));
      resolvers.push(resolveMany(model, async args => {
        return connection.getRepository(entityResolver.entity).find(args);
      }));
      resolvers.push(resolveSave(model, async model => {
        return connection.getRepository(entityResolver.entity).save(model);
      }));
      resolvers.push(resolveRemove(model, async model => {
        await connection.getRepository(entityResolver.entity).remove(model);
        return true
      }));

      /*const PostCategoriesResolver = resolveModelProperty(PostModel, "categories", async args => {
        return [{
          id: 1,
          name: "Hello"
        }];
      });*/
    }
  }
  return resolvers
}