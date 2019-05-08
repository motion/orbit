// @ts-ignore
import graphqlStyle from '!raw-loader!@o/graphiql/graphiql.css'
import GraphiQL from '@o/graphiql'
import { getGlobalConfig, useActiveSpace } from '@o/kit'
import { useNode } from '@o/ui'
import GraphiQLExplorer from 'graphiql-explorer'
import { buildClientSchema, getIntrospectionQuery } from 'graphql'
import React, { useEffect, useRef, useState } from 'react'
import ShadowDOM from 'react-shadow'

import { useThemeStore } from '../om/stores'

export function GraphExplorer() {
  const [space] = useActiveSpace()
  const { theme } = useThemeStore()
  const graphiql = useRef(null)
  const [state, setState] = useState({ schema: null, query: null })
  const { schema, query } = state
  const shadowRoot = useRef(null)
  const parentRoot = useNode({ map: x => x.parentElement })
  const explorerLeft =
    (shadowRoot.current && shadowRoot.current.querySelector('.graphiql-container').offsetLeft) || 0
  const codeMirrorTop =
    (shadowRoot.current && shadowRoot.current.querySelector('.query-editor').offsetTop) || 0
  const explorerTop =
    codeMirrorTop + ((parentRoot.current && parentRoot.current.getBoundingClientRect().y) || 0)

  useEffect(() => {
    fetcher(space.id, {
      query: getIntrospectionQuery(),
    }).then(result => {
      setState({ schema: buildClientSchema(result.data), query })
    })
  }, [space])

  return (
    <>
      <style
        ref={parentRoot.ref}
        dangerouslySetInnerHTML={{
          __html: `.resolved { flex: 1; overflow: hidden; }`,
        }}
      />
      <ShadowDOM>
        <div>
          <div
            style={{
              display: 'flex',
              flexFlow: 'row',
              flex: 1,
              overflow: 'hidden',
              color: theme.color.toString(),
            }}
            ref={shadowRoot}
          >
            <GraphiQLExplorer
              schema={schema}
              query={query}
              onEdit={query => setState({ ...state, query })}
              explorerIsOpen
              // explorerIsOpen={this.state.explorerIsOpen}
              // onToggleExplorer={this._handleToggleExplorer}
            />
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

                .CodeMirror-hints {
                  transform: translate3d(${-explorerLeft}px,-${explorerTop}px,0);
                }

                .graphiql-explorer-root {
                  border-right: 1px solid rgba(150,150,150,0.1);
                }

                .graphiql-container .title {
                  display: none;
                }

                .graphiql-container .execute-button {
                  background: rgba(150,150,150,0.2);
                  border: none;
                  box-shadow: none;
                }

                .graphiql-container .toolbar-button {
                  background: rgba(150,150,150,0.15);
                  border: none;
                  box-shadow: none;
                  color: inherit;
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

                .graphiql-explorer-root {
                  min-width: 200px;
                }

                .history-title-bar {
                  display: none;
                }

                .graphiql-explorer-node {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Droid Sans', 'Helvetica Neue', sans-serif;
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
      </ShadowDOM>
    </>
  )
}

function fetcher(spaceId: number, params: Object) {
  return fetch(`http://localhost:${getGlobalConfig().ports.graphServer}/graphql/${spaceId}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })
    .then(function(response) {
      return response.text()
    })
    .then(function(responseBody) {
      try {
        return JSON.parse(responseBody)
      } catch (e) {
        return responseBody
      }
    })
}