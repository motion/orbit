import * as parser from '@babel/parser'
import traverse from '@babel/traverse'
import { isObjectProperty, isStringLiteral } from '@babel/types'
import { getAppInfo } from '@o/apps-manager'
import { Logger } from '@o/logger'
import { AppDefinition, CommandBuildOptions, StatusReply } from '@o/models'
import { ensureDir, readFile, writeJSON } from 'fs-extra'
import { join } from 'path'

import { getAppEntry, shouldRebuildApp } from './commandBuild'

// let just use typescript and extract that

const log = new Logger('buildAppInfo')

export async function buildAppInfo(
  options: CommandBuildOptions = {
    projectRoot: '',
    watch: false,
  },
): Promise<StatusReply<AppDefinition>> {
  if (!(await shouldRebuildApp(options.projectRoot))) {
    return {
      type: 'success',
      message: 'Already built appInfo',
    }
  }
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
  const tree = parser.parse(await readFile(entryFile, 'utf8'), {
    sourceType: 'module',
    plugins: [
      'typescript',
      'jsx',
      'objectRestSpread',
      'classProperties',
      'classPrivateProperties',
      'classPrivateMethods',
      'exportDefaultFrom',
      'exportNamespaceFrom',
      'bigInt',
      'optionalCatchBinding',
      'throwExpressions',
      'nullishCoalescingOperator',
    ],
  })

  let apiInfo = {}

  // TODO we need to use this for the later parsing of api types, or move to babel...
  let nodeImports = []

  traverse(tree, {
    ImportDeclaration(path) {
      const importPath = path.node.source.value
      if (importPath.indexOf('.node') > -1) {
        nodeImports.push(importPath)
      }
    },
    ExportDefaultDeclaration(path) {
      path.traverse({
        CallExpression(path) {
          let didOnce = false // hack, prevent recursion
          path.traverse({
            ObjectExpression(path) {
              if (didOnce) return
              didOnce = true
              for (const prop of path.node.properties) {
                if (isObjectProperty(prop)) {
                  const key = prop.key.name
                  if (isStringLiteral(prop.value)) {
                    apiInfo[key] = prop.value.value
                  } else {
                    apiInfo[key] = true
                  }
                }
              }
            },
          })
        },
      })
    },
  })

  if (!apiInfo['id']) {
    return {
      type: 'error',
      message: `Didn't find export default that calls createApp({}) with id set to a string`,
    }
  }

  await ensureDir(join(appRoot, 'dist'))
  const out = join(appRoot, 'dist', 'appInfo.json')
  await writeJSON(out, apiInfo, {
    spaces: 2,
  })

  return {
    type: 'success',
    message: `Written to ${out}`,
  }
}
