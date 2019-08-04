import { Logger } from '@o/logger'
import { CommandOpts, resolveCommand } from '@o/mediator'
import { ApiInfo, AppGenTypesCommand, CommandGenTypesOptions, StatusReply } from '@o/models'
import { pathExists, writeJSON } from 'fs-extra'
import { join } from 'path'
import ts from 'typescript'

import { attachLogToCommand, statusReplyCommand } from './commandHelpers'

let checker: ts.TypeChecker

const log = new Logger('genTypesCommand')

export const resolveAppGenTypesCommand = resolveCommand(
  AppGenTypesCommand,
  statusReplyCommand(commandGenTypes),
)

export async function commandGenTypes(
  props: CommandGenTypesOptions,
  options?: CommandOpts,
): Promise<StatusReply> {
  if (options) {
    attachLogToCommand(log, options)
  }
  log.info('Running orbit gen-types')

  const apiEntry = join(props.projectEntry, '..', 'api.node.ts')

  if (!(await pathExists(apiEntry))) {
    return {
      type: 'error',
      message: 'Path doesnt exist',
    } as const
  }

  const program = ts.createProgram([apiEntry], compilerOptions)
  checker = program.getTypeChecker()

  const sourceFile = program.getSourceFile(apiEntry)
  const moduleSymbol = checker.getSymbolAtLocation(sourceFile)
  const exprts = checker.getExportsOfModule(moduleSymbol)

  const defaultExportSymbol = exprts.find(x => x.escapedName === 'default')

  if (!defaultExportSymbol) {
    return {
      type: 'success',
      message: 'gen-types no default export symbol found, not exporting node api types.',
    } as const
  }

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

  if (props.out) {
    await writeJSON(props.out, apiTypes, {
      spaces: 2,
    })
    return {
      type: 'success',
      message: `Written to ${props.out}`,
    } as const
  }

  console.log(`Found API types:

${JSON.stringify(apiTypes, null, 2)}

`)
}

const compilerOptions = JSON.parse(`{
  "compilerOptions": {
    "strict": true,
    "skipLibCheck": true,
    "rootDir": "src",
    "incremental": true,
    "declaration": true,
    "declarationMap": true,
    "module": "CommonJS",
    "removeComments": true,
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "target": "es2018",
    "noImplicitAny": false,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noEmitOnError": false,
    "strictNullChecks": false,
    "strictFunctionTypes": true,
    "preserveConstEnums": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "jsx": "react",
    "allowJs": false,
    "sourceMap": true,
    "resolveJsonModule": true,
    "lib": ["es2017", "es2018", "dom", "esnext.array"]
  },
  "include": ["src/**/*"],
  "exclude": ["**/*.test.ts", "**/*.test.tsx"]
}`)
