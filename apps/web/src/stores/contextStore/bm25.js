//     wink-bm25-text-search
//     Fast Full Text Search based on BM25F
//
//     Copyright (C) 2017  GRAYPE Systems Private Limited
//
//     This file is part of “wink-bm25-text-search”.
//
//     “wink-bm25-search” is free software: you can redistribute it
//     and/or modify it under the terms of the GNU Affero
//     General Public License as published by the Free
//     Software Foundation, version 3 of the License.
//
//     “wink-bm25-text-search” is distributed in the hope that it will
//     be useful, but WITHOUT ANY WARRANTY; without even
//     the implied warranty of MERCHANTABILITY or FITNESS
//     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
//     Public License for more details.
//
//     You should have received a copy of the GNU Affero
//     General Public License along with “wink-bm25-text-search”.
//     If not, see <http://www.gnu.org/licenses/>.

import helpers from 'wink-helpers'
import { invert } from 'lodash'

/* eslint guard-for-in: 0 */
/* eslint complexity: [ "error", 25 ] */

// It is a BM25F In-memory Search engine for text and exposes following
// methods:
// 1. `definePrepTasks` allows to define field-wise (optional) pipeline of
// functions that will be used to prepare each input prior to *search/predict*
// and *addDoc/learn*.
// 2. `defineConfig` sets up the configuration for *field-wise weights*,
// *BM25F parameters*, and **field names whoes original value** needs to be retained.
// 3. `addDoc/learn` adds a document using its unique id. The document is supplied
// as an Javascript object, where each property is the field of the document
// and its value is the text.
// 4. `consolidate` learnings prior to search/predict.
// 5. `search/predict` searches for the input text and returns the resultant
// document ids, sorted by their relevance along with the score. The number of
// results returned can be controlled via a limit argument that defaults to **10**.
// The last optional argument is a filter function that must return a `boolean`
// value, which is used to filter documents.
// 6. `exportJSON` exports the learnings in JSON format.
// 7. `importJSON` imports the learnings from JSON that may have been saved on disk.
// 8. `reset` all the learnings except the preparatory tasks.
const bm25fIMS = () => {
  // Preparatory tasks that are executed on the `addDoc` & `search` input.
  let pTasks = []
  // And its count.
  let pTaskCount
  // Field level prep tasks.
  const flds = Object.create(null)
  // Returned!
  const methods = Object.create(null)
  // Term Frequencies & length of each document.
  let documents = Object.create(null)
  // Inverted Index for faster search
  let invertedIdx = []
  // IDF for each tokens, tokens are referenced via their numerical index.
  let idf = []
  // Set true on first call to `addDoc/learn` to prevent changing config.
  let learned = false
  // The `addDoc()predict()` function checks for this being true; set
  // in `consolidate()`.
  let consolidated = false
  // Total documents added.
  let totalDocs = 0
  // Total number of tokens across all documents added.
  let totalCorpusLength = 0
  // Their average.
  let avgCorpusLength = 0
  // BM25F Configuration; set up in `defineConfig()`.
  let config = null
  // The `token: index` mapping; `index` is used everywhere instead
  // of the `token`
  let token2Index = Object.create(null)
  // Index's initial value, incremented with every new word.
  let currTokenIndex = 0

  // ### Private functions

  // #### Perpare Input

  // Prepares the `input` by executing the pipeline of tasks defined in the
  // `field` specific `pTasks` set via `definePrepTasks()`.
  // If `field` is not specified then default `pTasks` are used.
  // If the `field` specific `pTasks` are not defined then it automatically
  // switches to default `pTasks`.
  const prepareInput = (input, field) => {
    let processedInput = input
    const pt = (flds[field] && flds[field].pTasks) || pTasks
    const ptc = (flds[field] && flds[field].pTaskCount) || pTaskCount
    for (let i = 0; i < ptc; i += 1) {
      processedInput = pt[i](processedInput)
    }
    return processedInput
  } // prepareInput()

  // #### Update Freq

  // Updates the `freq` of each term in the `text` after pre-processing it via
  // `prepareInput()`; while updating, it takes care of `field's` `weight`.
  const updateFreq = (id, text, weight, freq, field) => {
    // Tokenized `text`.
    const tkns = prepareInput(text, field)
    // Temp token holder.
    let t
    for (let i = 0, imax = tkns.length; i < imax; i += 1) {
      t = tkns[i]
      // Build `token: index` mapping.
      if (token2Index[t] === undefined) {
        token2Index[t] = currTokenIndex
        currTokenIndex += 1
      }
      t = token2Index[t]
      if (freq[t] === undefined) {
        freq[t] = weight
        invertedIdx[t] = invertedIdx[t] || []
        invertedIdx[t].push(id)
      } else {
        freq[t] += weight
      }
    }
    // Length can not be negative!
    return tkns.length * Math.abs(weight)
  } // updateFreq()

  // ### Exposed Functions

  // #### Define Prep Tasks

  // Defines the `tasks` required to prepare the input for `addDoc` and `search()`
  // The `tasks` should be an array of functions; using these function a simple
  // pipeline is built to serially transform the input to the output.
  // It validates the `tasks` before updating the `pTasks`.
  // If validation fails it throws an appropriate error.
  // Tasks can be defined separately for each field. However if the field is not
  // specified (i.e. `null` or `undefined`), then the `tasks` become default.
  // Note, `field = 'search'` is reserved for prep tasks for search string; However
  // if the same is not specified, the default tasks are used for pre-processing.
  const definePrepTasks = (tasks, field) => {
    if (config === null) {
      throw Error(
        'winkBM25S: Config must be defined before defining prepTasks.'
      )
    }
    if (!helpers.array.isArray(tasks)) {
      throw Error(
        `winkBM25S: Tasks should be an array, instead found: ${JSON.stringify(
          tasks
        )}`
      )
    }
    for (let i = 0, imax = tasks.length; i < imax; i += 1) {
      if (typeof tasks[i] !== 'function') {
        throw Error(
          `winkBM25S: Tasks should contain function, instead found: ${typeof tasks[
            i
          ]}`
        )
      }
    }
    const fldWeights = config.fldWeights
    if (field === undefined || field === null) {
      pTasks = tasks
      pTaskCount = tasks.length
    } else {
      if (!fldWeights[field] || typeof field !== 'string') {
        throw Error(
          `winkBM25S: Field name is missing or it is not a string: ${JSON.stringify(
            field
          )}/${typeof field}`
        )
      }
      flds[field] = flds[field] || Object.create(null)
      flds[field].pTasks = tasks
      flds[field].pTaskCount = tasks.length
    }
    return tasks.length
  } // definePrepTasks()

  // #### Define Config

  // Defines the configuration for BM25F using `fldWeights` and `bm25Params`
  // properties of `cfg` object.</br>
  // The `fldWeights` defines the weight for each field of the document. This gives
  // a semantic nudge to search and are used as a mutiplier to the count
  // (frequency) of each token contained in that field of the document. It should
  // be a JS object containing `field-name/value` pairs. If a field's weight is
  // not defined, that field is **ignored**. The field weights must be defined before
  // attempting to add a document via `addDoc()`; they can only be defined once.
  // If any document's field is not defined here then that field is **ignored**.
  // </br>
  // The `k`, `b` and `k1` properties of `bm25Params` object define the smoothing
  // factor for IDF, degree of normalization for TF, and saturation control factor
  // respectively for the BM25F. Their default values are **1**, **0.75**, and
  // **1.2**.<br/>
  // The `ovFieldNames` is an array of field names whose original value needs to
  // be retained.
  const defineConfig = cfg => {
    if (learned) {
      throw Error(
        'winkBM25S: config must be defined before learning/addition starts!'
      )
    }
    if (!helpers.object.isObject(cfg)) {
      throw Error(
        `winkBM25S: config must be a config object, instead found: ${JSON.stringify(
          cfg
        )}`
      )
    }
    // If `fldWeights` are absent throw error.
    if (!helpers.object.isObject(cfg.fldWeights)) {
      throw Error(
        `winkBM25S: fldWeights must be an object, instead found: ${JSON.stringify(
          cfg.fldWeights
        )}`
      )
    }
    // There should be at least one defined field!
    if (helpers.object.keys(cfg.fldWeights).length === 0) {
      throw Error('winkBM25S: Field config has no field defined.')
    }
    // Setup configuration now.
    config = Object.create(null)
    // Field config for BM25**F**
    config.fldWeights = Object.create(null)
    config.bm25Params = Object.create(null)
    // **Controls TF part:**<br/>
    // `k1` controls saturation of token's frequency; higher value delays saturation
    // with increase in frequency.
    config.bm25Params.k1 = 1.2
    // `b` controls the degree of normalization; **0** means no normalization and **1**
    // indicates complete normalization!
    config.bm25Params.b = 0.75
    // **Controls IDF part:**<br/>
    // `k` controls impact of IDF; should be >= 0; a higher value means lower
    // the impact of IDF.
    config.bm25Params.k = 1
    // Setup field weights.
    for (const field in cfg.fldWeights) {
      // The `null` check is required as `isNaN( null )` returns `false`!!
      // This first ensures non-`null/undefined/0` values before testing for NaN.
      if (!cfg.fldWeights[field] || isNaN(cfg.fldWeights[field])) {
        throw Error(
          `winkBM25S: Field weight should be number >0, instead found: ${JSON.stringify(
            cfg.fldWeights[field]
          )}`
        )
      }
      // Update config parameters from `cfg`.
      config.fldWeights[field] = +cfg.fldWeights[field]
    }
    // Setup BM25F params.
    // Create `bm25Params` if absent in `cfg`.
    if (!helpers.object.isObject(cfg.bm25Params))
      cfg.bm25Params = Object.create(null)
    // Update config parameters from `cfg`.
    config.bm25Params.b =
      cfg.bm25Params.b === null ||
      cfg.bm25Params.b === undefined ||
      isNaN(cfg.bm25Params.b) ||
      (+cfg.bm25Params.b < 0 || +cfg.bm25Params.b > 1)
        ? 0.75
        : +cfg.bm25Params.b

    // Update config parameters from `cfg`.
    config.bm25Params.k1 =
      cfg.bm25Params.k1 === null ||
      cfg.bm25Params.k1 === undefined ||
      isNaN(cfg.bm25Params.k1) ||
      +cfg.bm25Params.k1 < 0
        ? 1.2
        : +cfg.bm25Params.k1

    // Update config parameters from `cfg`.
    config.bm25Params.k =
      cfg.bm25Params.k === null ||
      cfg.bm25Params.k === undefined ||
      isNaN(cfg.bm25Params.k) ||
      +cfg.bm25Params.k < 0
        ? 1
        : +cfg.bm25Params.k

    // Handle configuration for fields whose orginal values has to be retained
    // in the document.<br/>
    // Initialize the `ovFldNames` in the final `config` as an empty array
    config.ovFldNames = []
    if (!cfg.ovFldNames) cfg.ovFldNames = []
    if (!helpers.array.isArray(cfg.ovFldNames)) {
      throw Error(
        `winkBM25S: OV Field names should be an array, instead found: ${JSON.stringify(
          typeof cfg.ovFldNames
        )}`
      )
    }

    cfg.ovFldNames.forEach(f => {
      if (typeof f !== 'string' || f.length === 0) {
        throw Error(
          `winkBM25S: OV Field name should be a non-empty string, instead found: ${JSON.stringify(
            f
          )}`
        )
      }
      config.ovFldNames.push(f)
    })
    return true
  } // defineConfig()

  // #### Add Doc

  // Adds a document to the model using `updateFreq()` function.
  const addDoc = (doc, id) => {
    if (config === null) {
      throw Error('winkBM25S: Config must be defined before adding a document.')
    }
    const fldWeights = config.fldWeights
    // No point in adding/learning further in absence of consolidated.
    if (consolidated) {
      throw Error(
        'winkBM25S: post consolidation adding/learning is not possible!'
      )
    }
    // Set learning/addition started.
    learned = true
    let length
    if (documents[id] !== undefined) {
      throw Error(
        `winkBM25S: Duplicate document encountered: ${JSON.stringify(id)}`
      )
    }
    documents[id] = Object.create(null)
    documents[id].freq = Object.create(null)
    documents[id].fieldValues = Object.create(null)
    documents[id].length = 0
    // Compute `freq` & `length` of the specified fields.
    for (const field in fldWeights) {
      if (doc[field] === undefined) {
        throw Error(
          `winkBM25S: Missing field in the document: ${JSON.stringify(field)}`
        )
      }
      length = updateFreq(
        id,
        doc[field],
        fldWeights[field],
        documents[id].freq,
        field
      )
      documents[id].length += length
      totalCorpusLength += length
    }
    // Retain Original Field Values, if configured.
    config.ovFldNames.forEach(f => {
      if (doc[f] === undefined) {
        throw Error(
          `winkBM25S: Missing field in the document: ${JSON.stringify(f)}`
        )
      }
      documents[id].fieldValues[f] = doc[f]
    })
    // Increment total documents indexed so far.
    totalDocs += 1
    return totalDocs
  } // addDoc()

  // #### Consolidate

  // Consolidates the data structure of bm25 and computes the IDF. This must be
  // built before using the `search` function. The `fp` defines the precision at
  // which term frequency values are stored. The default value is **4**. In cause
  // of an invalid input, it default to 4. The maximum permitted value is 9; any
  // value larger than 9 is forced to 9.
  const consolidate = fp => {
    if (consolidated) {
      throw Error('winkBM25S: consolidation can be carried out only once!')
    }
    if (totalDocs < 3) {
      throw Error(
        'winkBM25S: document collection is too small for consolidation; add more docs!'
      )
    }
    let freqPrecision = parseInt(fp, 10)
    freqPrecision = isNaN(freqPrecision)
      ? 4
      : freqPrecision < 4 ? 4 : freqPrecision > 9 ? 9 : freqPrecision
    // Using the commonly used names but unfortunately they are very cryptic and
    // *short*. **Must not use these variable names elsewhere**.
    const b = config.bm25Params.b
    const k1 = config.bm25Params.k1
    const k = config.bm25Params.k
    let freq
    let id
    let n
    let normalizationFactor
    let t
    // Consolidate: compute idf; will multiply with freq to save multiplication
    // time during search. This happens in the next loop-block.
    for (let i = 0, imax = invertedIdx.length; i < imax; i += 1) {
      n = invertedIdx[i].length
      idf[i] = Math.log((totalDocs - n + 0.5) / (n + 0.5) + k)
      // To be uncommented to probe values!
      // console.log( '%s, %d, %d, %d, %d', t, totalDocs, n, k, idf[ t ] );
    }
    avgCorpusLength = totalCorpusLength / totalDocs
    // Consolidate: update document frequencies.
    for (id in documents) {
      normalizationFactor = 1 - b + b * (documents[id].length / avgCorpusLength)
      for (t in documents[id].freq) {
        freq = documents[id].freq[t]
        // Update frequency but ensure the sign is carefully preserved as the
        // magnitude of `k1` can jeopardize the sign!
        documents[id].freq[t] =
          Math.sign(freq) *
          (
            Math.abs(freq * (k1 + 1) / (k1 * normalizationFactor + freq)) *
            idf[t]
          ).toFixed(freqPrecision)
        // To be uncommented to probe values!
        // console.log( '%s, %s, %d', id, t, documents[ id ].freq[ t ] );
      }
    }
    // Set `consolidated` as `true`.
    consolidated = true
    return true
  } // consolidate()

  // #### Search

  // Searches the `text` and return `limit` results. If `limit` is not sepcified
  // then it will return a maximum of **10** results. The `result` is an array of
  // containing `doc id` and `score` pairs array. If the `text` is not found, an
  // empty array is returned. The `text` must be a string. The argurment `filter`
  // is like `filter` of JS Array; it receive an object containing document's
  // retained field name/value pairs along with the `params` (which is passed as
  // the second argument). It is useful in limiting the search space or making the
  // search more focussed.
  const search = (text, limit, filter, params) => {
    // Predict/Search only if learnings have been consolidated!
    if (!consolidated) {
      throw Error(
        'winkBM25S: search is not possible unless learnings are consolidated!'
      )
    }
    if (typeof text !== 'string') {
      throw Error(
        `winkBM25S: search text should be a string, instead found: ${typeof text}`
      )
    }
    // Setup filter function
    const f = typeof filter === 'function' ? filter : () => true
    // Tokenized `text`. Use search specific weights.
    const tkns = prepareInput(text, 'search')
      // Filter out tokens that do not exists in the vocabulary.
      .filter(t => token2Index[t] !== undefined)
      // Now map them to their respective indexes using `token2Index`.
      .map(t => token2Index[t])
    // Search results go here as doc id/score pairs.
    const results = Object.create(null)

    // Helper variables.
    let id

    let ids
    let t
    let i
    let imax
    let j
    let jmax
    // Iterate for every token in the preapred text.
    for (j = 0, jmax = tkns.length; j < jmax; j += 1) {
      t = tkns[j]
      // Use Inverted Idx to look up - accelerates search!<br/>
      // Note, `ids` can never be `undefined` as **unknown** tokens have already
      // been filtered.
      ids = invertedIdx[t]
      // Means the token exists in the vocabulary!
      // Compute scores for every document.
      for (i = 0, imax = ids.length; i < imax; i += 1) {
        id = ids[i]
        if (f(documents[id].fieldValues, params)) {
          results[id] = documents[id].freq[t] + (results[id] || 0)
        }
        // To be uncommented to probe values!
        /* console.log( '%s, %d, %d, %d', t, documents[ id ].freq[ t ], idf[ t ], results[ id ] ); */
      }
    }
    // Convert to a table in `[ id, score ]` format; sort and slice required number
    // of resultant documents.
    return helpers.object
      .table(results)
      .sort(helpers.array.descendingOnValue)
      .slice(0, Math.max(limit || 10, 1))
  } // search()

  // #### Reset

  // Resets the BM25F completely by re-initializing all the learning
  // related variables, except the preparatory tasks.
  const reset = () => {
    // Reset values of variables that are associated with learning; Therefore
    // `pTasks` & `pTaskCount` are not re-initialized.
    // Term Frequencies & length of each document.
    documents = Object.create(null)
    // Inverted Index for faster search
    invertedIdx = []
    // IDF for each tokens
    idf = []
    // Set true on first call to `addDoc/learn` to prevent changing config.
    learned = false
    // The `addDoc()predict()` function checks for this being true; set
    // in `consolidate()`.
    consolidated = false
    // Total documents added.
    totalDocs = 0
    // Total number of tokens across all documents added.
    totalCorpusLength = 0
    // Their average.
    avgCorpusLength = 0
    // BM25F Configuration; set up in `defineConfig()`.
    config = null
    // The `token: index` mapping; `index` is used everywhere instead
    // of the `token`
    token2Index = Object.create(null)
    // Index's initial value, incremented with every new word.
    currTokenIndex = 0
    return true
  } // reset()

  // #### Export JSON

  // Returns the learnings, along with `consolidated` flag, in JSON format.
  const exportJSON = () => {
    const docStats = Object.create(null)
    docStats.totalCorpusLength = totalCorpusLength
    docStats.totalDocs = totalDocs
    docStats.consolidated = consolidated
    return JSON.stringify([
      config,
      docStats,
      documents,
      invertedIdx,
      currTokenIndex,
      token2Index,
      // For future expansion but the import will have to have intelligence to
      // set the default values and still ensure nothing breaks! Hopefully!!
      {},
      [],
      [],
    ])
  } // exportJSON()

  // #### Import JSON

  // Imports the `json` in to index after validating the format of input JSON.
  // If validation fails then throws error; otherwise on success import it
  // returns `true`. Note, importing leads to resetting the search engine.
  const importJSON = json => {
    if (!json) {
      throw Error(
        'winkBM25S: undefined or null JSON encountered, import failed!'
      )
    }
    // Validate json format
    const isOK = [
      helpers.object.isObject,
      helpers.object.isObject,
      helpers.object.isObject,
      helpers.array.isArray,
      Number.isInteger,
      helpers.object.isObject,
      helpers.object.isObject,
      helpers.array.isArray,
      helpers.array.isArray,
    ]
    const parsedJSON = JSON.parse(json)
    if (
      !helpers.array.isArray(parsedJSON) ||
      parsedJSON.length !== isOK.length
    ) {
      throw Error('winkBM25S: invalid JSON encountered, can not import.')
    }
    for (let i = 0; i < isOK.length; i += 1) {
      if (!isOK[i](parsedJSON[i])) {
        throw Error('winkBM25S: invalid JSON encountered, can not import.')
      }
    }
    // All good, setup variable values.
    // First reset everything.
    reset()
    // To prevent config change.
    learned = true
    // Load variable values.
    config = parsedJSON[0]
    totalCorpusLength = parsedJSON[1].totalCorpusLength
    totalDocs = parsedJSON[1].totalDocs
    consolidated = parsedJSON[1].consolidated
    documents = parsedJSON[2]
    invertedIdx = parsedJSON[3]
    currTokenIndex = parsedJSON[4]
    token2Index = parsedJSON[5]
    // Return success.
    return true
  } // importJSON()

  methods.definePrepTasks = definePrepTasks
  methods.defineConfig = defineConfig
  methods.addDoc = addDoc
  methods.consolidate = consolidate
  methods.isConsolidated = () => consolidated
  methods.search = search
  methods.exportJSON = exportJSON
  methods.importJSON = importJSON
  methods.reset = reset
  methods.getIndex2Token = () => invert(token2Index)
  methods.idf = idf
  methods.documents = documents
  methods.getWeights = text =>
    prepareInput(text, 'search')
      // Filter out tokens that do not exists in the vocabulary.
      .filter(t => token2Index[t] !== undefined)
      // Now map them to their respective indexes using `token2Index`.
      .map(t => ({ t, weight: token2Index[t] }))
  // Aliases to keep APIs uniform across.
  methods.learn = addDoc
  methods.predict = search

  return methods
} // bm25fIMS()

export default bm25fIMS
