import { getConnection, getRepository } from 'typeorm'

/**
 * Handles received primus server actions,
 * actions that needs to manipulate with the database.
 */
export function handlePrimusEntityActions(spark: any, data: any) {
  console.log('primus received data', data)

  // check if data has all necessary stuff
  if (!data.operation || !data.entity || !data.operationId) {
    console.log(`wrong operation was received, cannot handle`)
    return
  }

  // find entity type that is requested
  const entityTarget = getConnection().entityMetadatas.find(metadata => {
    return metadata.targetName === data.entity
  })
  if (!entityTarget) {
    console.error(`${data.entity} entity was not found`, getConnection().entityMetadatas)
    return;
  }

  // get the repository and register a callback that will handle repository method calls
  const repository = getRepository(entityTarget.target)
  const sendResultsBack = result => {
    console.log(`operation ${data.operation} executed successfully`, result)
    spark.write({
      operationId: data.operationId,
      entity: data.entity,
      result: result
    })
  }

  // do repository actions based on operation type
  switch (data.operation) {
    case 'save':
      // @ts-ignore (to make it possible to pass dynamic arguments to repository methods)
      return repository
        .save(...data.parameters)
        .then(sendResultsBack)

    case 'remove':
      // @ts-ignore (to make it possible to pass dynamic arguments to repository methods)
      return repository
        .remove(...data.parameters)
        .then(sendResultsBack)

    case 'count':
      return repository
        .count(...data.parameters)
        .then(sendResultsBack)

    case 'find':
      return repository
        .find(...data.parameters)
        .then(sendResultsBack)

    case 'findOne':
      return getRepository(entityTarget.target)
        .findOne(...data.parameters)
        .then(sendResultsBack)

    case 'findAndCount':
      return getRepository(entityTarget.target)
        .findAndCount(...data.parameters)
        .then(sendResultsBack)

    case 'findByIds':
      // @ts-ignore (to make it possible to pass dynamic arguments to repository methods)
      return getRepository(entityTarget.target)
        .findByIds(...data.parameters)
        .then(sendResultsBack)

    case 'query':
      // @ts-ignore (to make it possible to pass dynamic arguments to repository methods)
      return getRepository(entityTarget.target)
        .query(...data.parameters)
        .then(sendResultsBack)

    case 'clear':
      return getRepository(entityTarget.target)
        .clear()
        .then(sendResultsBack)

    default:
      throw new Error(`given operation "${data.operation}" is not valid`)
  }
}
