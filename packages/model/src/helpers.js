// @flow
import type Model from './model'

export const applyHooks = (model: Model) => {
  // PRE-INSERT
  const ogInsert = model.hooks.preInsert
  model.hooks.preInsert = (doc: Object) => {
    model.applyDefaults(doc)
    if (model.hasTimestamps) {
      doc.createdAt = model.now
      doc.updatedAt = model.now
    }
    if (model.options.debug) {
      console.log(
        `%cINSERT ${model.constructor.name}.create(${JSON.stringify(
          doc,
          null,
          2
        )})`,
        'color: green'
      )
    }
    if (ogInsert) {
      return ogInsert.call(model, doc)
    }
  }

  // PRE-SAVE
  const ogSave = model.hooks.preSave
  model.hooks.preSave = (doc: Object) => {
    if (model.hasTimestamps) {
      doc.updatedAt = model.now
      // 🐛 model handles upsert not using preInsert (i think)
      if (!doc.createdAt) {
        doc.createdAt = model.now
      }
    }
    if (ogSave) {
      return ogSave.call(model, doc)
    }
  }

  // POST-CREATE
  // decorate each instance with model.methods
  const ogPostCreate = model.hooks.postCreate
  model.hooks.postCreate = doc => {
    const compiledMethods = model.compiledMethods(doc)
    if (compiledMethods) {
      for (const method of Object.keys(compiledMethods)) {
        const descriptor = compiledMethods[method]
        // autobind
        if (typeof descriptor.get === 'function') {
          descriptor.get = descriptor.get.bind(doc)
        }
        if (typeof descriptor.value === 'function') {
          descriptor.value = descriptor.value.bind(doc)
        }
      }
    } else {
      console.warn('no methods')
    }
    Object.defineProperties(doc, compiledMethods)
    if (ogPostCreate) {
      ogPostCreate.call(model, doc)
    }
  }

  if (model._collection && model.hooks) {
    Object.keys(model.hooks).forEach((hook: () => Promise<any>) => {
      model._collection[hook](model.hooks[hook])
    })
  }
}
