import styled from 'astroturf'
import { stripIndent } from 'common-tags'
import 'prismjs/components/prism-clike'
import { highlight, languages } from 'prismjs/components/prism-core'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-markup'
import PropTypes from 'prop-types'
import mapProps from 'recompose/mapProps'

const prism = (code, language = 'jsx') => highlight(code, languages[language])

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
