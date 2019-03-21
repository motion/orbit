import styled from 'astroturf'
import { stripIndent } from 'common-tags'
import * as Prism from 'prismjs'
import PropTypes from 'prop-types'
import mapProps from 'recompose/mapProps'

// loadLanguages(['javascript', 'markup'])

const prism = (code, language = 'jsx') => Prism.highlight(code, Prism.languages[language])

const CodeBlock = mapProps(({ mode, codeText, ...props }) => ({
  ...props,
  dangerouslySetInnerHTML: {
    __html: mode === null ? codeText : prism(stripIndent([codeText]), mode || 'jsx'),
  },
}))(
  styled('pre')`
    composes: prism from '../css/prism.module.scss';

    border-radius: 8px;
    margin: 0 -1rem 3rem;

    :global(.card) & {
      margin: 0;
      border-radius: 0 0 5px 5px;
    }
  `,
)

CodeBlock.propTypes = {
  codeText: PropTypes.string.isRequired,
}

export default CodeBlock
