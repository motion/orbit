// @flow
import type Model from './model'

export const formatDates = (model: Model, doc: Object) {
  if (doc.updatedAt) {
    doc.updatedAt = model.toDate(doc.updatedAt)
  }
  if (doc.createdAt) {
    doc.createdAt = model.toDate(doc.createdAt)
  }
}

export const applyHooks = (model: Model) => {
  // PRE-INSERT
  const ogInsert = model.hooks.preInsert
  model.hooks.preInsert = (doc: Object) => {
    model.applyDefaults(doc)
    if (model.hasTimestamps) {
      if (!doc.createdAt || doc.createdAt === true) {
        doc.createdAt = model.now
      }
      if (!doc.updatedAt || doc.updatedAt === true) {
        doc.updatedAt = model.now
      }
    }
    if (ogInsert) {
      return ogInsert.call(model, doc)
    }
  }

  // PRE-SAVE
  const ogSave = model.hooks.preSave
  model.hooks.preSave = (doc: Object) => {
    if (model.hasTimestamps) {
      if (!doc.updatedAt || doc.updatedAt === true) {
        doc.updatedAt = model.now
      }
    }
    if (ogSave) {
      return ogSave.call(model, doc)
    }
  }

  // POST-INSERT
  // this is called when a new model has been inserted
  const ogPostInsert = model.hooks.postInsert
  model.hooks.postInsert = (doc: Object) => {
    if (model.options.debug) {
      // add some helper logs
      console.log(
        `INSERT ${model.constructor.name} #${doc.id ||
          doc._id ||
          doc.name ||
          doc.title}`
      )
    }
    if (ogPostInsert) {
      ogPostInsert.call(model, doc)
    }
  }

  // POST-CREATE
  // this when any model is instantiated
  const ogPostCreate = model.hooks.postCreate
  const compiledMethods = model.compiledMethods()
  model.hooks.postCreate = doc => {
    if (compiledMethods) {
      for (const method of Object.keys(compiledMethods)) {
        const descriptor = compiledMethods[method]
        // bind to doc
        // set ogXXX so we don't keep nesting bind
        if (typeof descriptor.get === 'function') {
          descriptor.ogGet = descriptor.ogGet || descriptor.get
          descriptor.get = descriptor.ogGet.bind(doc)
        }
        if (typeof descriptor.value === 'function') {
          descriptor.ogValue = descriptor.ogValue || descriptor.value
          descriptor.value = descriptor.ogValue.bind(doc)
        }
      }
    } else {
      console.warn('no compiledMethods')
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
