import { DeepPartial, FindOptions, RemoveOptions, SaveOptions } from 'typeorm'
import { Provider } from './Provider'

export type RepositoryOperationType =
  | 'create'
  | 'save'
  | 'remove'
  | 'count'
  | 'find'
  | 'findOne'
  | 'findAndCount'
  | 'findByIds'
  | 'query'
  | 'clear'

export class Repository<T> {
  name: string
  provider: Provider

  constructor(name: string, provider: Provider) {
    this.name = name
    this.provider = provider
  }

  /**
   * Creates a new entity instance.
   */
  create(): T;

  /**
   * Creates a new entities and copies all entity properties from given objects into their new entities.
   * Note that it copies only properties that present in entity schema.
   */
  create(entityLikeArray: DeepPartial<T>[]): T;

  /**
   * Creates a new entity instance and copies all entity properties from this object into a new entity.
   * Note that it copies only properties that present in entity schema.
   */
  create(entityLike: DeepPartial<T>): T;

  /**
   * Creates a new entity instance and copies all entity properties from this object into a new entity.
   * Note that it copies only properties that present in entity schema.
   */
  create(entityLike?: DeepPartial<T> | DeepPartial<T>[]): T {
    if (entityLike instanceof Array) {
      return Object.assign({}, ...entityLike)

    } else if (entityLike instanceof Object) {
      return Object.assign({} as T, entityLike)
    }

    return {} as T
  }

  /**
   * Saves all given entities in the database.
   * If entities do not exist in the database then inserts, otherwise updates.
   */
  save(entities: T[], options?: SaveOptions): Promise<T[]>;

  /**
   * Saves a given entity in the database.
   * If entity does not exist in the database then inserts, otherwise updates.
   */
  save(entity: T, options?: SaveOptions): Promise<T>;

  /**
   * Saves a given entity in the database.
   * If entity does not exist in the database then inserts, otherwise updates.
   */
  save(entity: T | T[], options?: SaveOptions): Promise<T | T[]> {
    return this.provider.execute(this.name, 'save', [entity, options])
  }

  /**
   * Removes a given entities from the database.
   */
  remove(entities: T[], options?: RemoveOptions): Promise<T[]>;

  /**
   * Removes a given entity from the database.
   */
  remove(entity: T, options?: RemoveOptions): Promise<T>;

  /**
   * Removes a given entity from the database.
   */
  remove(entity: T | T[], options?: RemoveOptions): Promise<T | T[]> {
    return this.provider.execute(this.name, 'remove', [entity, options])
  }

  /**
   * Counts entities that match given options.
   */
  count(options?: FindOptions<T>): Promise<number>;

  /**
   * Counts entities that match given conditions.
   */
  count(conditions?: DeepPartial<T>): Promise<number>;

  /**
   * Counts entities that match given conditions.
   */
  count(optionsOrConditions?: FindOptions<T> | DeepPartial<T>): Promise<number> {
    return this.provider.execute(this.name, 'count', [optionsOrConditions])
  }

  /**
   * Finds entities that match given options.
   */
  find(options?: FindOptions<T>): Promise<T[]>;

  /**
   * Finds entities that match given conditions.
   */
  find(conditions?: DeepPartial<T>): Promise<T[]>;

  /**
   * Finds entities that match given conditions.
   */
  find(optionsOrConditions?: FindOptions<T> | DeepPartial<T>): Promise<T[]> {
    return this.provider.execute(this.name, 'find', [optionsOrConditions])
  }

  /**
   * Finds entities that match given find options.
   * Also counts all entities that match given conditions,
   * but ignores pagination settings (from and take options).
   */
  findAndCount(options?: FindOptions<T>): Promise<[T[], number]>;

  /**
   * Finds entities that match given conditions.
   * Also counts all entities that match given conditions,
   * but ignores pagination settings (from and take options).
   */
  findAndCount(conditions?: DeepPartial<T>): Promise<[T[], number]>;

  /**
   * Finds entities that match given conditions.
   * Also counts all entities that match given conditions,
   * but ignores pagination settings (from and take options).
   */
  findAndCount(optionsOrConditions?: FindOptions<T> | DeepPartial<T>): Promise<[T[], number]> {
    return this.provider.execute(this.name, 'findAndCount', [optionsOrConditions])
  }

  /**
   * Finds entities by ids.
   * Optionally find options can be applied.
   */
  findByIds(ids: any[], options?: FindOptions<T>): Promise<T[]>;

  /**
   * Finds entities by ids.
   * Optionally conditions can be applied.
   */
  findByIds(ids: any[], conditions?: DeepPartial<T>): Promise<T[]>;

  /**
   * Finds entities by ids.
   * Optionally conditions can be applied.
   */
  findByIds(ids: any[], optionsOrConditions?: FindOptions<T> | DeepPartial<T>): Promise<T[]> {
    return this.provider.execute(this.name, 'findByIds', [ids, optionsOrConditions])
  }

  /**
   * Finds first entity that matches given options.
   */
  findOne(id?: string | number, options?: FindOptions<T>): Promise<T | undefined>;

  /**
   * Finds first entity that matches given options.
   */
  findOne(options?: FindOptions<T>): Promise<T | undefined>;

  /**
   * Finds first entity that matches given conditions.
   */
  findOne(conditions?: DeepPartial<T>, options?: FindOptions<T>): Promise<T | undefined>;

  /**
   * Finds first entity that matches given conditions.
   */
  findOne(idOrOptionsOrConditions?: string | number | FindOptions<T> | DeepPartial<T>, maybeOptions?: FindOptions<T>): Promise<T | undefined> {
    return this.provider.execute(this.name, 'findOne', [idOrOptionsOrConditions, maybeOptions])
  }

  /**
   * Executes a raw SQL query and returns a raw database results.
   * Raw query execution is supported only by relational databases (MongoDB is not supported).
   */
  query(query: string, parameters?: any[]): Promise<any> {
    return this.provider.execute(this.name, 'query', [query, parameters])
  }

  /**
   * Clears all the data from the given table/collection (truncates/drops it).
   */
  clear(): Promise<void> {
    return this.provider.execute(this.name, 'clear')
  }

}