import * as Models from '../models'

export default async function createModels(db) {
  const models = {}
  for (const name of Object.keys(Models)) {
    models[name] = new Models[name](db)
    await models[name].connect()
  }
  return models
}
