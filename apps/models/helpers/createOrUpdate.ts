import { pick, isEqual } from 'lodash'

const DEFAULTS = {
  returnIfUnchanged: false,
}

export type CreateOrUpdateOpts = {
  matching?: string[]
  updateIf?: Function
  returnIfUnchanged?: boolean
}

export async function createOrUpdate(
  Model: any,
  values: Object,
  { matching, returnIfUnchanged, updateIf }: CreateOrUpdateOpts = DEFAULTS,
) {
  const finalFields = matching ? pick(values, matching) : values
  let item
  const found = await Model.findOne({ where: finalFields })
  if (found) {
    item = found
    if (updateIf) {
      if (!updateIf(found)) {
        return null
      }
    }
  } else {
    item = new Model()
  }
  const itemVals = Object.keys(values).reduce(
    (a, b) => ({ ...a, [b]: item[b] }),
    {},
  )
  const changed = !isEqual(itemVals, values)
  // return null on no update by default
  //   if returnIfUnchanged = true, skip this
  if (!returnIfUnchanged && !changed) {
    return null
  }
  if (changed) {
    for (const key of Object.keys(values)) {
      item[key] = values[key]
    }
    try {
      await item.save()
    } catch (err) {
      console.trace('createOrUpdate Error', err, values)
      throw err
    }
  }
  return item
}
