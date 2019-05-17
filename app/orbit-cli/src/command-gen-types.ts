import { readJSON } from 'fs-extra'
import path, { join } from 'path'
import ts from 'typescript'

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

  const symbol = defaultExportType.symbol

  console.log('symbol', symbol.getName())

  for (const sig of defaultExportType.getCallSignatures()) {
    const returns = sig.getReturnType()

    if (returns) {
      const returnApiProperties = returns.getApparentProperties()

      for (const prop of returnApiProperties) {
        const type = checker.getTypeOfSymbolAtLocation(prop, prop.valueDeclaration)

        console.log('type', checker.typeToString(type))
      }
    }
  }

  return
}
