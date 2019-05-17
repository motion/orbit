import { readJSON } from 'fs-extra'
import path, { join } from 'path'
import ts from 'typescript'

type TypeDesc = {
  name
  params
}

type ApiType = {
  name: string
  typeString: string
  comment: string
  types: TypeDesc[]
}

export async function commandGenTypes(options: { projectRoot: string; projectEntry: string }) {
  const compilerOptions = await readJSON(path.join(__dirname, '..', 'project-tsconfig.json'))
  const apiEntry = join(options.projectEntry, '..', 'api.node.ts')

  const program = ts.createProgram([apiEntry], compilerOptions)
  const checker = program.getTypeChecker()

  const sourceFile = program.getSourceFile(apiEntry)
  const moduleSymbol = checker.getSymbolAtLocation(sourceFile)
  const exprts = checker.getExportsOfModule(moduleSymbol)

  const defaultExportSymbol = exprts.find(x => x.escapedName === 'default')

  const defaultExportType = checker.getTypeOfSymbolAtLocation(
    defaultExportSymbol,
    defaultExportSymbol.valueDeclaration,
  )

  let apiTypes: ApiType[] = []

  for (const sig of defaultExportType.getCallSignatures()) {
    const returns = sig.getReturnType()

    if (returns) {
      const returnApiProperties = returns.getApparentProperties()

      for (const prop of returnApiProperties) {
        const type = checker.getTypeOfSymbolAtLocation(prop, prop.valueDeclaration)
        const typeString = checker.typeToString(type)
        const comment =
          prop.getDocumentationComment &&
          ts.displayPartsToString(prop.getDocumentationComment(checker))

        // if (type.symbol.members) {
        //   type.symbol.members.forEach(x => {
        //     console.log(x.getName(), x.getDocumentationComment(checker))
        //   })
        // }

        apiTypes.push({
          name: prop.getName(),
          typeString,
          comment,
          types: [],
        })
      }
    }
  }

  return apiTypes
}
