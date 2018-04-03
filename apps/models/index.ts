import 'reflect-metadata'
import { getConnection } from 'typeorm'

export * from './helpers'

// ⭐️ ADD MODELS HERE:

export * from './job'
export * from './setting'
export * from './bit'

// helpers for queryBuilder
export const select = (model, query) =>
  getConnection()
    .createQueryBuilder(model)
    .select(query)
export const remove = model =>
  getConnection()
    .createQueryBuilder()
    .delete()
    .from(model)
export const update = model =>
  getConnection()
    .createQueryBuilder()
    .update(model)
export const insert = model =>
  getConnection()
    .createQueryBuilder()
    .insert()
    .into(model)
