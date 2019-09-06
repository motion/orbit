import graphqlStyle from '!raw-loader!@o/graphiql/graphiql.css'
import GraphiQL from '@o/graphiql'
import { getGlobalConfig, useActiveSpace } from '@o/kit'
import GraphiQLExplorer from 'graphiql-explorer'
import { buildClientSchema, getIntrospectionQuery, GraphQLSchema } from 'graphql'
import React, { useEffect, useRef, useState } from 'react'
import { cold } from 'react-hot-loader'
import ShadowDOM from 'react-shadow'

import { useThemeStore } from '../om/stores'

export const useGraphExplorer = () => {
  const [space] = useActiveSpace()
  const graphiql = useRef<any>(null)
  const [state, setState] = useState<{
    schema: GraphQLSchema | null
    query: string
  }>({
    schema: null,
    query: '',
  })
  const { schema, query } = state

  useEffect(() => {
    spaceFetcher(space.id || -1, {
      query: getIntrospectionQuery(),
    }).then(result => {
      if (result.type === 'error') {
        console.error(result.value)
      } else {
        setState({ schema: buildClientSchema(result.value.data), query })
      }
    })
  }, [])

  return {
    graphiql,
    schema,
    query,
    setState,
    state,
    fetcher: (params: Object) => spaceFetcher(space.id || -1, params).then(x => x.value),
  }
}

export function GraphExplorer({
  schema,
  query,
  setState,
  state,
}: ReturnType<typeof useGraphExplorer>) {
  const { theme } = useThemeStore()
  return (
    <ShadowDOM.div style={{ pointerEvents: 'inherit', height: '100%' }}>
      <div style={{ height: '100%', padding: 10 }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            height: '100%',
            flex: 1,
            overflow: 'hidden',
            color: `${theme.color}`,
          }}
        >
          <GraphiQLExplorer
            schema={schema}
            query={query}
            onEdit={query => setState({ ...state, query })}
            explorerIsOpen
            // explorerIsOpen={this.state.explorerIsOpen}
            // onToggleExplorer={this._handleToggleExplorer}
          />
        </div>
        <style
          dangerouslySetInnerHTML={{
            __html: graphqlStyle,
          }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :host {
                all: initial;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
    'Cantarell', 'Droid Sans', 'Helvetica Neue', sans-serif;
              }

              :host > span {
                width: 100%;
                height: 100%;
                max-width: 100%;
                max-height: 100%;
                overflow: hidden;
                display: flex;
                flex-direction: row;
              }

              * {
                box-sizing: border-box;
                outline: 0;
              }

              .graphiql-explorer-node {
                font-family: inherit !important;
              }

              .graphiql-explorer-root {
                border-right: 1px solid rgba(150,150,150,0.1);
              }

              .graphiql-explorer-node {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Droid Sans', 'Helvetica Neue', sans-serif;
              }

              .theme-dark .graphiql-explorer-node span {
                color: inherit !important;
              }

              .toolbar-button {
                background: rgba(150,150,150,0.15) !important;
                color: inherit !important;
                font-size: 12px !important;
                text-overflow: ellipsis;
                overflow: hidden;
              }

              input {
                background: none;
              }

              #query-MyQuery {
                border-bottom: none !important;
              }

              .history-title-bar {
                display: none;
              }
            `,
          }}
        />
      </div>
    </ShadowDOM.div>
  )
}

// <style
// ref={parentRoot.ref}
// dangerouslySetInnerHTML={{
//   __html: `.resolved { flex: 1; overflow: hidden; }`,
// }}
// />

export function GraphQueryExplorer({
  schema,
  query,
  setState,
  state,
  graphiql,
  fetcher,
}: ReturnType<typeof useGraphExplorer>) {
  const { theme } = useThemeStore()

  return (
    <ShadowDOM.div style={{ pointerEvents: 'inherit', height: '100%' }}>
      <div style={{ height: '100%' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            height: '100%',
            flex: 1,
            overflow: 'hidden',
            color: `${theme.color}`,
          }}
        >
          <GraphiQL
            ref={graphiql}
            fetcher={fetcher}
            schema={schema}
            query={query}
            onEditQuery={query => setState({ ...state, query })}
          >
            <GraphiQL.Toolbar>
              <GraphiQL.Button
                onClick={() => graphiql.current.handlePrettifyQuery()}
                title="Prettify Query (Shift-Ctrl-P)"
                label="Prettify"
              />
              <GraphiQL.Button
                onClick={() => graphiql.current.handleToggleHistory()}
                title="Show History"
                label="History"
              />
              <GraphiQL.Button
                // onClick={this._handleToggleExplorer}
                title="Toggle Explorer"
                label="Explorer"
              />
            </GraphiQL.Toolbar>
          </GraphiQL>
        </div>
        <style
          dangerouslySetInnerHTML={{
            __html: graphqlStyle,
          }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :host {
                all: initial;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
    'Cantarell', 'Droid Sans', 'Helvetica Neue', sans-serif;
              }

              :host > span {
                width: 100%;
                height: 100%;
                max-width: 100%;
                max-height: 100%;
                overflow: hidden;
                display: flex;
                flex-direction: row;
              }

                * {
                box-sizing: border-box;
                outline: 0;
              }

              .graphiql-container {
                width: auto;
                height: auto;
                color: inherit;
                display: flex;
                flex: 3;
                font-family: inherit;
              }

              .toolbar-button {
                background: rgba(150,150,150,0.15) !important;
                color: inherit !important;
                font-size: 12px !important;
                text-overflow: ellipsis;
                overflow: hidden;
              }

              .graphiql-container .toolbar-button {
                border: none;
                box-shadow: none;
                color: inherit;
                padding: 2px 6px;
                font-size: 12px;
              }

              .editorWrap {
                height: 100%;
              }

              .history-contents {
                overflow-y: auto;
                flex: 1;
                display: flex;
                height: 100%;
              }

              .historyPaneWrap {
                display: flex;
                flex: 1;
                min-width: 100px;
                padding: 5px;
              }

              .graphiql-container .title {
                display: none;
              }

              .graphiql-container .execute-button {
                background: rgba(150,150,150,0.2);
                border: none;
                box-shadow: none;
                transform: scale(0.8);
              }

              .graphiql-container .execute-button svg {
                transform: translateY(1px);
                fill: currentColor;
              }

              .graphiql-container .topBar {
                background: transparent;
                border-bottom: 1px solid rgba(150,150,150,0.1);
              }

              .graphiql-container .docExplorerShow {
                border-left: 1px solid rgba(150,150,150,0.1);
                border-bottom: none;
                background: none;
                color: inherit;
              }

              .graphiql-container .variable-editor-title {
                background: none;
                border-bottom: none;
                border-top: 1px solid rgba(150,150,150,0.1);
              }

              .graphiql-container .result-window .CodeMirror-gutters {
                background: transparent;
                border-color: rgba(150,150,150,0.1);
              }

              .graphiql-container .resultWrap {
                border-left: none;
              }

              .result-window .CodeMirror {
                background: none;
              }

              .graphiql-container .execute-button-wrap {
                margin-left: 0;
              }

              .graphiql-container .result-window .CodeMirror-foldgutter {
                width: 3px;
                padding-left: 2;
              }

              .CodeMirror {
                background: transparent;
              }

              .CodeMirror-gutters {
                background: rgba(150,150,150,0.1);
              }

              .CodeMirror-foldgutter {
                width: 6px;
              }

              .CodeMirror-gutters {
                border-right: none;
              }

              .CodeMirror-linenumbers {
                display: none;
              }

              .CodeMirror-gutter-wrapper {
                display: none;
              }

              .CodeMirror-sizer {
                margin-left: 12px !important;
              }
            `,
          }}
        />
      </div>
    </ShadowDOM.div>
  )
}

function spaceFetcher(
  spaceId: number,
  params: Object,
): Promise<{ type: 'error' | 'success'; value: any }> {
  return new Promise(finish => {
    fetch(`http://localhost:${getGlobalConfig().ports.graphServer}/graphql/${spaceId}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })
      .then(res => res.json())
      .then(value => {
        if (value.error) {
          throw value.error
        }
        finish({ type: 'success', value })
      })
  })
}

cold(GraphQueryExplorer)
cold(GraphExplorer)
