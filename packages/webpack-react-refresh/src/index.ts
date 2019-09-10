export class ReactRefreshPlugin {
  apply(compiler) {
    compiler.hooks.normalModuleFactory.tap('ReactRefreshPlugin', nmf => {
      nmf.hooks.afterResolve.tap('ReactRefreshPlugin', data => {
        if (/webpack-react-refresh/.test(data.resource)) {
          return data
        }
        if (data.rawRequest === 'react-dom') {
          data.loaders.unshift({
            loader: require.resolve('./ReactDOMLoader'),
          })
        } else if (/\.[jt]sx$/.test(data.resource)) {
          data.loaders.unshift({
            loader: require.resolve('./HotModuleLoader'),
          })
        }

        return data
      })
    })

    compiler.hooks.compilation.tap('ReactRefreshPlugin', compilation => {
      compilation.mainTemplate.hooks.require.tap('ReactRefreshPlugin', source => {
        const lines = source.split('\n')

        let isModuleRunner = -1

        for (const [index, line] of lines.entries()) {
          if (line.startsWith('modules[moduleId].call')) {
            isModuleRunner = index
            break
          }
        }

        if (isModuleRunner > -1) {
          lines.splice(
            isModuleRunner,
            1,
            `var cleanup = this.__setupReactRefreshForModule ? this.__setupReactRefreshForModule(module.i) : function() {};
            try {
              ${lines[isModuleRunner]}
            } finally {
              cleanup();
            }
            `,
          )
          return lines.join('\n')
        }

        return source
      })
    })
  }
}
