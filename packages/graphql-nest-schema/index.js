const { transformSchema, RenameRootFields, RenameTypes } = require(`graphql-tools`)
const invariant = require(`invariant`)

const { NamespaceUnderFieldTransform } = require(`./transforms`)

exports.nestSchema = async function nestSchema(options) {
  const { typeName, fieldName, schema } = options

  invariant(
    typeName && typeName.length > 0,
    `nest-schema requires option \`typeName\` to be specified`,
  )
  invariant(
    fieldName && fieldName.length > 0,
    `nest-schema requires option \`fieldName\` to be specified`,
  )

  const resolver = () => {
    return {}
  }

  return transformSchema(schema, [
    new RenameTypes(name => `${typeName}_${name}`),
    new RenameRootFields((operation, name) => {
      if (operation === 'Mutation' || operation === 'Subscription') {
        return `${typeName}_${name}`
      }
      return name
    }),
    new NamespaceUnderFieldTransform({
      typeName,
      fieldName,
      resolver,
    }),
  ])
}
