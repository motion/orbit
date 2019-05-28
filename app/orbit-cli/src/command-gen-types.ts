import { ApiInfo } from '@o/models'
import { pathExists, readJSON, writeJSON } from 'fs-extra'
import path, { join } from 'path'
import ts from 'typescript'

let checker: ts.TypeChecker

export async function commandGenTypes(options: {
  projectRoot: string
  projectEntry: string
  out?: string
}) {
  const compilerOptions = await readJSON(path.join(__dirname, '..', 'project-tsconfig.json'))
  const apiEntry = join(options.projectEntry, '..', 'api.node.ts')

  if (!(await pathExists(apiEntry))) {
    return
  }

  const program = ts.createProgram([apiEntry], compilerOptions)
  checker = program.getTypeChecker()

  const sourceFile = program.getSourceFile(apiEntry)
  const moduleSymbol = checker.getSymbolAtLocation(sourceFile)
  const exprts = checker.getExportsOfModule(moduleSymbol)

  const defaultExportSymbol = exprts.find(x => x.escapedName === 'default')

  const defaultExportType = checker.getTypeOfSymbolAtLocation(
    defaultExportSymbol,
    defaultExportSymbol.valueDeclaration,
  )

  let apiTypes: ApiInfo = {}

  for (const sig of defaultExportType.getCallSignatures()) {
    const returns = sig.getReturnType()

    if (returns) {
      const returnApiProperties = returns.getApparentProperties()

      for (const prop of returnApiProperties) {
        const name = prop.getName()
        const type = checker.getTypeOfSymbolAtLocation(prop, prop.valueDeclaration)
        const typeString = checker.typeToString(type)
        const comment =
          prop.getDocumentationComment &&
          ts.displayPartsToString(prop.getDocumentationComment(checker))
        const args = []

        // get args
        const callSignatures = type.getCallSignatures()
        if (callSignatures[0]) {
          const params = callSignatures[0].getParameters()
          for (const param of params) {
            const type = checker.getTypeOfSymbolAtLocation(param, param.valueDeclaration)
            const paramDec = checker.symbolToParameterDeclaration(param)
            const isOptional = !!(paramDec && paramDec.questionToken)
            args.push({
              name: param.escapedName,
              type: checker.typeToString(type),
              isOptional,
            })
          }
        }

        apiTypes[name] = {
          name,
          args,
          typeString,
          comment,
        }
      }
    }
  }

  if (options.out) {
    await writeJSON(options.out, apiTypes, {
      spaces: 2,
    })
    console.log(`Written to ${options.out}`)
    return
  }

  console.log(`Found API types:

${JSON.stringify(apiTypes, null, 2)}

`)
}
