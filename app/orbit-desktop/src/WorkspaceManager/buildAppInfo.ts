import { getAppInfo } from '@o/apps-manager'
import { Logger } from '@o/logger'
import { AppDefinition, CommandBuildOptions, StatusReply } from '@o/models'
import { writeJSON } from 'fs-extra'
import { join } from 'path'
import ts from 'typescript'

import { getAppEntry } from './commandBuild'
import { compilerOptions } from './compilerOptions'

// let just use typescript and extract that

const log = new Logger('buildAppInfo')

export async function buildAppInfo(
  options: CommandBuildOptions = {
    projectRoot: '',
    watch: false,
  },
): Promise<StatusReply<AppDefinition>> {
  log.info(`Generating app info`, options)
  try {
    // build appInfo first, we can then use it to determine if we need to build web/node
    await writeAppInfo(options.projectRoot)
    return {
      type: 'success',
      message: `Built successfully`,
      value: await getAppInfo(options.projectRoot),
    }
  } catch (err) {
    return {
      type: 'error',
      message: err.message,
      errors: [err],
    }
  }
}

async function writeAppInfo(appRoot: string): Promise<StatusReply> {
  const entryFile = await getAppEntry(appRoot)
  const program = ts.createProgram([entryFile], compilerOptions)
  const checker = program.getTypeChecker()
  const sourceFile = program.getSourceFile(entryFile)
  const moduleSymbol = checker.getSymbolAtLocation(sourceFile)
  const exprts = checker.getExportsOfModule(moduleSymbol)
  const defaultExportSymbol = exprts.find(x => x.escapedName === 'default')

  if (!defaultExportSymbol) {
    return {
      type: 'error',
      message: `No default export found at app entry ${entryFile}`,
    }
  }

  const defaultExportType = checker.getTypeOfSymbolAtLocation(
    defaultExportSymbol,
    defaultExportSymbol.valueDeclaration,
  )

  const properties = defaultExportType.getApparentProperties()

  for (const prop of properties) {
    const name = prop.getName()
    const type = checker.getTypeOfSymbolAtLocation(prop, prop.valueDeclaration)
    const typeString = checker.typeToString(type)
    const node = checker.typeToTypeNode(type)
    // let value = null
    if (node && type) {
      console.log('ok', name, typeString, type['text'], node.getText(), node['text'])
    }
  }

  const out = join(appRoot, 'dist', 'appInfo.json')
  await writeJSON(
    out,
    {},
    {
      spaces: 2,
    },
  )

  return {
    type: 'success',
    message: `Written to ${out}`,
  }
}
